'use strict';

// Create global object for the game
window.assets = {};

// Add global static URL
assets.STATIC = './';

// Preload 'loading' image (to prevent irony)
assets.preloader_image = new Image();
assets.preloader_image.src = assets.STATIC + 'img/loading.svg';

/**
 *  @function passive allow passive event handlers for (e.g.) @event touchmove
 */
window.passive = function () {
  var test_passive_events_supported = false;

  try {
    document.addEventListener('test', null, {
      get passive() {
        test_passive_events_supported = {
          passive: false
        };
      }
    });
  } catch (e) {
    console.warn('Your browser does not support passive events. Please upgrade.');
  }

  return test_passive_events_supported;
}();

/**
 *  Create a window to house all game elements (makes it easier to center-align content visually)
 */
window.gamearea = document.createElement('div');
window.gamearea.classList.add('window');
document.body.appendChild(window.gamearea);

/**
 *  @constructor
 *  @function Menu creates a menu for the game, showing lives, score, this.reset etc.
 *  @param {Integer} starting_lives number of lives at start of game (default, 3)
 */
function Menu(starting_lives) {
  var _this = this;

  // Show lives (carrots)
  this.lives_to_carrots = function (lives) {
    // Clear existing lives
    while (this.lifebar.firstChild && this.lifebar.removeChild(this.lifebar.firstChild)) {}

    // Display carrot for each existing life
    while (lives--) {
      var carrot = images.life.cloneNode(true);
      this.lifebar.appendChild(carrot);
    };
  };

  // Create elements
  this.wrapper = document.createElement('div');
  this.lifebar = document.createElement('span');
  this.scorebar = document.createElement('span');
  this.reset = document.createElement('button');
  this.text = document.createTextNode('Reset');

  // Add classes to elements
  this.wrapper.classList.add('menu');
  this.lifebar.classList.add('lives');
  this.scorebar.classList.add('score');
  this.reset.classList.add('reset');

  // Add objects to map
  gamearea.appendChild(this.reset);
  gamearea.appendChild(this.wrapper);
  this.wrapper.appendChild(this.scorebar);
  this.wrapper.appendChild(this.lifebar);
  this.reset.appendChild(this.text);

  // Print initial values
  this.lives_to_carrots(starting_lives);
  this.scorebar.innerHTML = '0';

  // Functions for showing defaults
  this.print_score = function (score) {
    return _this.scorebar.innerHTML = score;
  };
  this.print_lives = function (lives) {
    return _this.lives_to_carrots(lives);
  };

  // Allow this.reset
  this.reset.addEventListener('click', function (e) {
    e.preventDefault();

    while (gamearea.firstChild && gamearea.removeChild(gamearea.firstChild)) {}
    window.play = new Game();
  });
}

/**
 *  @function calc some useful functions for perfoming quick calculations
 */
window.calc = function () {
  var method = {};

  // Quick PI functions
  var X2PI = Math.PI * 2;
  var PI = Math.PI;
  var PI8 = PI / 8;
  var PI4 = PI / 4;
  var PI38 = 3 * (PI / 8);
  var PI2 = PI / 2;
  var PI58 = 5 * (PI / 8);
  var PI34 = 3 * (PI / 4);
  var PI78 = 7 * (PI / 8);
  var DEG = 180 / PI;

  // Allow other functions to use variables
  method.X2PI = X2PI;
  method.PI8 = PI8;
  method.PI4 = PI4;
  method.PI38 = PI38;
  method.PI2 = PI2;
  method.PI58 = PI58;
  method.PI34 = PI34;
  method.PI78 = PI78;
  method.DEG = DEG;

  // Create random direction
  method.random_direction = function () {
    return Math.random() * PI * 2 - PI;
  };

  // Number between 2 others
  method.between = function (number, lower, upper) {
    return number >= lower && number <= upper;
  };

  // Get hypotenuse between two lengths
  method.hypotenuse = function (x, y) {
    return Math.sqrt(Number(x * x + y * y));
  };

  // Get hypotenuse between 2two coordinates
  method.hypotenuseCoords = function (x1, y1, x2, y2) {
    return Math.sqrt(Number((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
  };

  // Check distance between 2 objects (with coordinates)
  method.distance = function (obj1, obj2) {
    return method.hypotenuseCoords(obj1.x, obj1.y, obj2.x, obj2.y);
  };

  // Check distance between 2 objects (with coordinates)
  method.angle = function (obj1, obj2) {
    return method.lengthToAngle(obj1.x - obj2.x, obj1.y - obj2.y);
  };

  // Check is within range of number
  method.inRange = function (number, abs) {
    return Math.max(Math.min(number, abs), -abs);
  };

  // Convert two lengths to an angle
  method.lengthToAngle = function (x, y) {
    return Math.atan2(y, x);
  };

  // Convert an angle and distance to two lengths
  method.angleToLength = function (angle, h) {
    return [h * Math.cos(angle), h * Math.cos(PI2 - angle)];
  };

  // Convert rads to degrees
  method.Rad2Deg = function (rad) {
    return rad * DEG;
  };

  return method;
}();

/*
 *  Load images
 */
window.images = function () {
  var DONKEY_FRAME_COUNT = 13;
  var BANDIT_FRAME_COUNT = 13;
  var EXPLOSION_FRAME_COUNT = 8;

  var self = {};
  var images = {};
  var audio = {};
  var video = {};

  self.assets_to_load = [];

  /**
   *  Non-canvas images
   */
  images.background = new Image();
  images.background.src = assets.STATIC + 'img/bg.png';

  images.menu_tab_left = new Image();
  images.menu_tab_left.src = assets.STATIC + 'img/menu-tab-left.png';

  images.menu_tab_middle = new Image();
  images.menu_tab_middle.src = assets.STATIC + 'img/menu-tab-middle.png';

  images.menu_tab_right = new Image();
  images.menu_tab_right.src = assets.STATIC + 'img/menu-tab-right.png';

  /**
   *  Canvas images
   */
  self.cactus = new Image();
  self.cactus.src = assets.STATIC + 'img/cactus.png';

  self.barrels = new Image();
  self.barrels.src = assets.STATIC + 'img/barrels.png';

  self.carrot = new Image();
  self.carrot.src = assets.STATIC + 'img/carrot.png';

  self.life = new Image();
  self.life.src = assets.STATIC + 'img/life.png';

  /**
   *  Donkey
   */
  self.donkey = [];

  for (var i = 0; i < DONKEY_FRAME_COUNT; i++) {
    var frame = new Image();
    frame.src = assets.STATIC + 'img/donkey/donkey' + i + '.png';
    self.donkey.push(frame);

    // Also add images to loader
    self.assets_to_load.push(frame);
  }

  /**
   *  Bandit
   */
  self.bandit = [];

  for (var _i = 0; _i < BANDIT_FRAME_COUNT; _i++) {
    var _frame = new Image();
    _frame.src = assets.STATIC + 'img/bandit/bandit' + _i + '.png';
    self.bandit.push(_frame);

    // Also add images to loader
    self.assets_to_load.push(_frame);
  }

  /**
   *  Explosion
   */
  self.explosion = [];

  for (var _i2 = 0; _i2 < EXPLOSION_FRAME_COUNT; _i2++) {
    var _frame2 = new Image();
    _frame2.src = assets.STATIC + 'img/explosion/explosion' + _i2 + '.png';
    self.explosion.push(_frame2);

    // Also add images to loader
    self.assets_to_load.push(_frame2);
  }

  /**
   *  Array of assets (for loading)
   */
  self.assets_to_load.push(self.cactus, self.life, self.carrot, self.barrels, images.background, images.menu_tab_left, images.menu_tab_middle, images.menu_tab_right);

  return self;
}();

// Allow game to be playable (set to false during animations, etc)
window.playable = false;

/**
 *  @constructor
 *  @function Map create a new map for the game (incl. canvas and context)
 */
function Map(game) {
  var _this2 = this;

  var MAX_WIDTH = 1024;
  var MAX_HEIGHT = 600;

  // Scale canvas on mobile (for HD displays)
  var TABLET_BREAKPOINT_WIDTH = 1050;
  var MOBILE_BREAKPOINT_WIDTH = 760;
  var MOBILE_SCALE = 1.5;

  // Set default sizes
  var canvas_width = Math.min(window.innerWidth, MAX_WIDTH);
  var canvas_height = Math.min(window.innerHeight, MAX_HEIGHT);

  // Get game wrapper
  this.wrapper = game;

  // Add absolute size to canvas and background
  this.set_position = function (scale) {
    this.wrapper.style.width = canvas_width + 'px';
    this.wrapper.style.height = canvas_height + 'px';
    this.wrapper.style.left = (this.width - canvas_width) / 2 + 'px';
    this.wrapper.style.top = (this.height - canvas_height) / 2 + 'px';
    this.wrapper.style.transform = scale ? 'scale(' + 1 / MOBILE_SCALE + ')' : 'none';
  };

  // Re-calculate sizes on screen resize
  this.resize_screen = function () {
    // Re-check mobile view
    var is_tablet = window.innerWidth < TABLET_BREAKPOINT_WIDTH;
    var is_mobile = window.innerWidth < MOBILE_BREAKPOINT_WIDTH;

    // Reset widths and heights
    canvas_width = is_tablet ? window.innerWidth : Math.min(window.innerWidth, MAX_WIDTH);
    canvas_height = is_tablet ? window.innerHeight : Math.min(window.innerHeight, MAX_HEIGHT);

    if (is_mobile) {
      canvas_width *= MOBILE_SCALE;
      canvas_height *= MOBILE_SCALE;

      this.wrapper.classList.add('scaled');
    } else {
      this.wrapper.classList.remove('scaled');
    }

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = canvas_width;
    this.canvas.height = canvas_height;
    this.offset = this.canvas.getBoundingClientRect();
    this.centerX = canvas_width / 2;
    this.centerY = canvas_height / 2;
    this.windowX = window.innerWidth / 2;
    this.windowY = window.innerHeight / 2;

    // Re-draw player if necessary
    if (window.play) play.player.draw(this.canvas);

    this.set_position(is_mobile);
  };

  // Get window width
  this.width = window.innerWidth;
  this.height = window.innerHeight;

  // Get canvas center position
  this.centerX = canvas_width / 2;
  this.centerY = canvas_height / 2;
  this.windowX = window.innerWidth / 2;
  this.windowY = window.innerHeight / 2;

  // Create canvas
  this.canvas = document.createElement('canvas');
  this.canvas.width = canvas_width;
  this.canvas.height = canvas_height;
  this.canvas.classList.add('game');

  // Create div for background
  this.bg = document.createElement('div');
  this.bg.classList.add('background');

  // Create context for canvas
  this.canvas.ctx = this.canvas.getContext('2d');

  // Disable image smoothing (for performance)
  this.canvas.CanvasImageSmoothing = false;

  // Add canvas and background to screen
  this.wrapper.appendChild(this.bg);
  this.wrapper.appendChild(this.canvas);

  // Get offset (for later use)
  this.offset = this.canvas.getBoundingClientRect();

  // Set screen size and positions
  this.resize_screen();

  // Add event handler for screen size changes
  window.addEventListener('load', function () {
    return _this2.resize_screen();
  });
  window.addEventListener('resize', function () {
    return _this2.resize_screen();
  });
  window.addEventListener('orientationchange', function () {
    return _this2.resize_screen();
  });
}

/**
 *  @function gameplay functions for controlling gameplay (e.g. reset functions)
 */
window.gameplay = function () {
  var method = {};

  /**
   *  @function soft_reset Used to refresh objects and players, but retain player information (such as number of lives, etc)
   *  @param {Object} background the current background position of the player
   */
  method.soft_reset = function (session, background) {
    // Remove all existing objects
    session.objects = [];
    session.bandits = [];
    session.bonuses = [];
    session.explosions = [];

    // Reset background coordinates
    if (background) {
      background.x = 0;
      background.y = 0;
    }

    // Reset player speed and direction
    session.player.direction = 0;
    session.player.speed = 0;

    // Reset player dragging/touching inputs
    session.player.end_joystick_input();

    // Reset background position
    session.map.bg.style.backgroundPosition = '';
  };

  /**
   *  @function hard_reset Used to reset all data (i.e. in the event of a restart or the player losing - resets all data)
   *  @param {Boolean} forced if true, hard_reset is user-invoked, else the user lost
   */
  method.hard_reset = function (session, forced) {
    // Perform a soft reset
    method.soft_reset(session, null);

    // Show alert/share for final score
    if (!forced) {
      alert('Oh no, you lost! Your final score was ' + parseInt(session.player.score));
    }

    // Restart the game
    while (gamearea.firstChild && gamearea.removeChild(gamearea.firstChild)) {}
    window.play = new Game();
  };

  return method;
}();

/**
 *  @function SplashScreen
 *  Create a splash screen to start the game, with possible
 *  'change settings' tab
 */
function SplashScreen() {}

/**
 *  @constructor
 *  @function Item creates a new item to be drawn on the canvas
 *  @param {integer} x - top-left X-position of item to be generated
 *  @param {integer} y - top-left Y-position of item to be generated
 *  @param {integer} diameter - width and height of generated image (all generated images are square)
 *  @param {string} image - src of image to draw
 */
function Item(x, y, diameter, image) {
  this.x = Number(x);
  this.y = Number(y);
  this.d = Number(diameter);
  this.d2 = Number(diameter / 2);
  this.image = image;
  this.delete_distance = 1000;
  this.collide_distance = 40;

  /**
   *  @function update_position update object position
   *  @param {integer} moveX distance player has moved horizontally since last render
   *  @param {integer} moveY distance player has moved vertically since last render
   */
  this.update_position = function (moveX, moveY) {
    this.x = this.x - moveX;
    this.y = this.y - moveY;
  };

  /**
   *  @function remove_old_objects remove objects sufficiently off screen
   */
  this.remove_old_objects = function (array, canvas, index) {
    var distance = this.delete_distance;
    if (!calc.between(this.x, -distance, parseInt(canvas.width + distance)) || !calc.between(this.y, -distance, parseInt(canvas.height + distance))) {
      array.splice(index, 1);
      if (this.canvas && this.canvas.length) gamearea.removeChild(this.canvas);
    }
  };

  /**
   *  @function collided check if the bandit has collided with the player
   *  @param {Integer} x center of canvas (x-axis)
   *  @param {Integer} y center of canvas (y-axis)
   *  @param {Object} game current game
   */
  this.collided = function (x, y, game) {
    var player = {
      x: x, y: y
    };
    var object = {
      x: this.x,
      y: this.y
    };

    var distance = calc.distance(player, object);

    if (distance < this.collide_distance) game.crash();

    return false;
  };
}

/**
 *  @function ObjectMovable add moveable draw function to objects
 */
function ObjectMovable() {
  /**
   *  @function draw
   */
  this.draw = function (ctx) {
    var _ctx = this.ctx;
    var _width = this.canvas.width;
    var _height = this.canvas.width;
    var _x = _width / -2;
    var _y = _height / -2;

    // Clear canvas
    _ctx.clearRect(0, 0, _width, _height);

    // Draw rotated image
    _ctx.save();
    _ctx.translate(_width / 2, _height / 2);
    _ctx.rotate(this.angle);
    _ctx.drawImage(this.image.src, _x, _y, _width, _height);
    _ctx.restore();

    // Translate that animation onto the main canvas
    ctx.drawImage(this.canvas, parseInt(this.x + _x), parseInt(this.y + _y));
  };
}

/**
 *  @function ObjectPosition determines which direction a new object is generated from
 *  @argument {object} map called via new Map()
 *  @argument {integer} rads the current angle that the player is facing (in radians)
 *  @return {this.x, this.y}
 */
function ObjectPosition(map, rads) {
  var random = Math.random();
  var original_offset = 100;

  // Coordinates for generated object
  this.x = 0;
  this.y = 0;

  // Get angles
  var ANGLE = Math.abs(rads);
  var CORNER = random < 0.5;

  // RIGHT
  if (ANGLE < calc.PI8) {
    this.x = map.width + original_offset;
    this.y = parseInt(random * map.height);
  }

  // LEFT
  else if (ANGLE > calc.PI78) {
      this.x = -original_offset;
      this.y = parseInt(random * map.width);
    } else {
      var half_width = map.width / 2;
      var half_height = map.height / 2;

      if (rads > 0) {
        // BOTTOM-RIGHT
        if (ANGLE < calc.PI38) {
          this.x = CORNER ? parseInt(half_width + random * half_width) : map.width + original_offset;
          this.y = CORNER ? map.height + original_offset : parseInt(half_height + random * half_height);
        }

        // BOTTOM
        else if (ANGLE < calc.PI58) {
            this.x = parseInt(random * map.width);
            this.y = map.height + original_offset;
          }

          // BOTTOM LEFT
          else {
              this.x = CORNER ? parseInt(random * half_width) : -original_offset;
              this.y = CORNER ? map.height + original_offset : parseInt(half_height + random * half_height);
            }
      } else {
        // TOP-RIGHT
        if (ANGLE < calc.PI38) {
          this.x = CORNER ? parseInt(half_width + random * half_width) : map.width + original_offset;
          this.y = CORNER ? -original_offset : parseInt(random * half_height);
        }

        // TOP
        else if (ANGLE < calc.PI58) {
            this.x = parseInt(random * map.width);
            this.y = -original_offset;
          }

          // TOP LEFT
          else {
              this.x = CORNER ? parseInt(random * half_width) : -original_offset;
              this.y = CORNER ? -original_offset : parseInt(random * half_height);
            }
      }
    }
}

/**
 *  @constructor
 *  @function Bandit
 *  @implements {Item}
 *  Create a bandit
 */
function Bandit(x, y, angle, speed, type) {
  var _this3 = this;

  var CANVAS_DIAMETER = 130;
  var ANIMATION_FRAME_COUNT = 13;
  var FRAME_CHANGE_SPEED = speed / 17; // or fixed at 0.5;

  Item.call(this, x, y, CANVAS_DIAMETER, type);
  ObjectMovable.call(this);

  this.image = {
    src: images.bandit[0],
    current_frame: 0

    // Other default settings
  };this.angle = angle;
  this.speed = speed;
  this.speed_multiplier = 0.005;
  this.direction_change_multiplier = 0.1;
  this.collide_distance = 50;
  this.crashed = false;

  // Create canvas (for more optimised Bandit animations)
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add('bandit');
  this.canvas.width = CANVAS_DIAMETER;
  this.canvas.height = CANVAS_DIAMETER;
  this.ctx = this.canvas.getContext('2d');

  // Append canvas to game area
  gamearea.appendChild(this.canvas);

  /**
   *  @function chase move Bandot in addition to its already updated position
   *  @param {Object} center object containing the center coordinates of the screen
   */
  this.chase = function (center) {
    if (_this3.crashed) return false;

    _this3.speed += _this3.speed_multiplier;

    // Get direction from bandit to player
    var player_angle = calc.angle(center, _this3);

    // Move a few pixels towards player
    var move_by = calc.angleToLength(player_angle, _this3.speed);

    // Store new angle and movement
    _this3.x += move_by[0];
    _this3.y += move_by[1];

    // Store angle for drawing
    _this3.angle = player_angle;
  };

  /**
   *  @function new_frame update current frame of Bandit
   */
  this.new_frame = function () {
    // Update frame count
    this.image.current_frame += FRAME_CHANGE_SPEED;

    // Check frames havent exceeded max
    if (this.image.current_frame >= ANIMATION_FRAME_COUNT) this.image.current_frame = 0;

    // Store absolute value
    var frame_as_integer = Math.floor(this.image.current_frame);

    // Update image with relevant frame
    this.image.src = images.bandit[frame_as_integer];
  };

  /**
   *  @function crashed check if the bandit has crashed at all
   *  @param {Array} Obstacles list of all objects
   */
  this.hit_object = function (obstacles) {
    if (_this3.crashed) return false;

    for (var item in obstacles) {
      // Poll distance between object and bandit
      var distance = calc.distance(_this3, obstacles[item]);

      // Check for minimum distance
      if (distance < _this3.collide_distance) _this3.crashed = true;
    }
  };
}

/**
 *  @constructor
 *  @function Bonus
 *  @implements {Item}
 *  Create a bonus item
 */
function Bonus(x, y, width, height, type) {
  Item.call(this, x, y, width, height, type);

  /**
   *  @function collect
   */
  this.collect = function () {
    console.log('You collected with a bonus item');
  };

  /**
   *  @function draw
   */
  this.draw = function (x, y) {
    return console.log('Show bonus');
  };
}

/**
 *  @constructor
 *  @function Obstacle
 *  @implements {Item}
 *  Create a obstacle
 */
function Obstacle(x, y, width, height, type) {
  var _this4 = this;

  Item.call(this, x, y, width, height, type);

  /**
   *  @function draw
   */
  this.draw = function (ctx) {
    return ctx.drawImage(_this4.image, parseInt(_this4.x - _this4.d2), parseInt(_this4.y - _this4.d2), _this4.d, _this4.d);
  };
}

/**
 *  @constructor
 *  @function Explosion
 *  @implements {Item}
 *  Create a temporary explosion of dust
 */
function Explosion(x, y) {
  var CANVAS_WIDTH = 260;
  var CANVAS_HEIGHT = 260;

  // Inherit properties for constructor
  Item.call(this, x, y, CANVAS_WIDTH, CANVAS_HEIGHT, 'Explosion');
  ObjectMovable.call(this);

  // Get image frame count for Explosion
  var FRAMES = 8;

  this.image = {
    src: images.explosion[0],
    current_frame: 0

    // Create canvas (for more optimised Explosion animations)
  };this.canvas = document.createElement('canvas');
  this.canvas.classList.add('explosion');
  this.canvas.width = CANVAS_WIDTH;
  this.canvas.height = CANVAS_HEIGHT;
  this.ctx = this.canvas.getContext('2d');

  // Append canvas to game area
  gamearea.appendChild(this.canvas);

  /**
   *  @function new_frame update current frame of Explosion
   *  @param {Array} explosions array containing all current explosions
   *  @param {Integer} index current index of explosion in explosions array
   */
  this.new_frame = function (explosions, index) {
    // Update frame count
    this.image.current_frame += 0.35;

    // Check frames havent exceeded max
    if (this.image.current_frame >= FRAMES) {
      explosions.splice(index, 1);
      gamearea.removeChild(this.canvas);

      return false;
    };

    // Store absolute value
    var frame_as_integer = Math.floor(this.image.current_frame);

    // Update image with relevant frame
    this.image.src = images.explosion[frame_as_integer];
  };
}

/**
 *  @constructor
 *  @function Player creates a new player, with lives, scores, controls and interactivity stored within
 *  @param {object} map called via new Map()
 */
var Player = function Player(game, map, is_touch) {
  var _this5 = this;

  if (!map) return false;

  // Controls
  var JOYSTICK_DRAG_LIMIT = 20;
  var MOUSE_DRAG_LIMIT = 100;

  // Images
  var ANIMATION_FRAME_COUNT = 13;
  var IMAGE_WIDTH = 130;
  var IMAGE_HEIGHT = 60;
  var IMAGE_CANVAS_X = -IMAGE_WIDTH / 2;
  var IMAGE_CANVAS_Y = -IMAGE_HEIGHT / 2;

  // Image object
  this.image = {
    src: images.donkey[0],
    current_frame: 0

    // Wrapper
  };this.wrapper = game;

  // Default settings
  this.lives = 3;
  this.max_lives = 5;
  this.score = 0;
  this.speed = 0;
  this.moved = 0;
  this.direction = 0;

  // Create control wrapper
  this.joystick = document.createElement('div');
  this.joystick.classList.add('controls');

  // Create control toggle
  this.joythumb = document.createElement('div');
  this.joythumb.classList.add('stick');

  // Create canvas (for more optimised Player animations)
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add('player');
  this.canvas.width = 130;
  this.canvas.height = 130;
  this.ctx = this.canvas.getContext('2d');

  // Append objects to document
  this.joystick.appendChild(this.joythumb);
  this.wrapper.appendChild(this.joystick);
  this.wrapper.appendChild(this.canvas);

  // Allow player to gain/lose a life
  this.lose_life = function () {
    return _this5.lives -= 1;
  };
  this.gain_life = function () {
    return _this5.lives < 5 ? _this5.lives += 1 : _this5.lives;
  };

  // Update current animation frame for donkey
  this.new_frame = function () {
    // Update frame count
    this.image.current_frame += this.speed / 2;

    // Check frames havent exceeded max
    if (this.image.current_frame >= ANIMATION_FRAME_COUNT) this.image.current_frame = 0;

    // Store absolute value
    var frame_as_integer = Math.floor(this.image.current_frame);

    // Update image with relevant frame
    this.image.src = images.donkey[frame_as_integer];
  };

  // Draw current frame onto canvas
  this.draw = function (map) {
    var _ctx = this.ctx;
    var _width = this.canvas.width;
    var _height = this.canvas.height;

    // Clear canvas
    _ctx.clearRect(0, 0, _width, _height);

    // Draw rotated donkey
    _ctx.save();
    _ctx.translate(_width / 2, _height / 2);
    _ctx.rotate(this.direction);
    _ctx.drawImage(this.image.src, IMAGE_CANVAS_X, IMAGE_CANVAS_Y, IMAGE_WIDTH, IMAGE_HEIGHT);
    _ctx.restore();

    // Get position to draw donkey on main canvas
    var _x = map.width / 2 - this.canvas.width / 2;
    var _y = map.height / 2 - this.canvas.height / 2;

    // Translate that animation onto the main canvas
    map.ctx.drawImage(this.canvas, _x, _y);
  };

  /**
   *  Add event listeners for player
   */
  var self = this;

  var touching = is_touch;
  var dragging = false;

  var start_x = map.width / 2;
  var start_y = map.height / 2;
  var drag_x = 0;
  var drag_y = 0;

  this.start_joystick_input = function (e) {
    if (!playable) return false;

    e.preventDefault();

    // Show/hide joystick for touch users
    self.joystick.style.display = touching ? 'block' : 'none';

    dragging = true;

    start_x = Number(touching ? e.touches[0].pageX - map.offset.left : map.windowX);
    start_y = Number(touching ? e.touches[0].pageY - map.offset.top : map.windowY);
  };

  this.move_joystick_input = function (e) {
    if (!playable) return false;

    if (touching || dragging) {
      e.preventDefault();

      drag_x = Number(touching ? e.touches[0].pageX : e.pageX) - start_x;
      drag_y = Number(touching ? e.touches[0].pageY : e.pageY) - start_y;

      // Enable larger drag distance for desktop devices (i.e. if 'touching')
      var drag_max = touching ? JOYSTICK_DRAG_LIMIT : MOUSE_DRAG_LIMIT;
      var drag_distance = calc.inRange(calc.hypotenuse(drag_x, drag_y), drag_max);
      var drag_angle = calc.lengthToAngle(drag_x, drag_y);
      var constraints = calc.angleToLength(drag_angle, drag_distance);

      self.joythumb.style.transition = 'none';
      self.joythumb.style.transform = 'translate(' + constraints[0] + 'px, ' + constraints[1] + 'px)';

      self.moved = touching ? drag_distance / 1.8 : drag_distance / 8;
      self.speed = touching ? drag_distance / JOYSTICK_DRAG_LIMIT : drag_distance / MOUSE_DRAG_LIMIT;
      self.direction = drag_angle;
    }
  };

  this.end_joystick_input = function () {
    dragging = false;
    touching = false;

    self.joythumb.style.transition = null;
    self.joythumb.style.transform = null;

    self.joythumb.speed = 0;
  };

  // Start drag events (mouse)
  this.joythumb.addEventListener('mousedown', function (e) {
    _this5.start_joystick_input(e, false);
  }, passive);

  // Start drag events (touch)
  this.joythumb.addEventListener('touchstart', function (e) {
    touching = true;
    _this5.start_joystick_input(e, true);
  }, passive);

  // Allow desktop users to drag anywhere (need to check this always relates to center of screen)
  map.canvas.addEventListener('mousedown', this.start_joystick_input, passive);

  // Move drag events
  window.addEventListener('mousemove', this.move_joystick_input, passive);
  window.addEventListener('touchmove', this.move_joystick_input, passive);

  // Terminate drag events
  window.addEventListener('touchend', this.end_joystick_input);
  window.addEventListener('mouseup', this.end_joystick_input);

  // Show touch controls on touchStart
  window.addEventListener('touchstart', function () {
    return _this5.joystick.style.display = 'block';
  });
};

function Game() {
  var self = {};

  // Ensure game window is empty
  while (gamearea.firstChild && gamearea.removeChild(gamearea.firstChild)) {}

  // Test if touchscreen or desktop
  self.is_touch = false;

  // Allow pausing of the game
  self.paused = true;

  // Create canvas
  self.map = new Map(gamearea);

  // Create player
  self.player = new Player(gamearea, self.map, self.is_touch);

  // Create interactive elements (e.g. score, pause/play button, etc)
  self.menu = new Menu(self.player.lives);

  // Store existing view
  self.position = [0, 0];

  // Store existing objects
  self.objects = [];
  self.bandits = [];
  self.bonuses = [];
  self.explosions = [];

  // Set a maximum number of objects to be generated at one time
  var MAX_OBJECT_COUNT = 3;
  var MAX_BANDIT_COUNT = 3;
  var MAX_BONUS_COUNT = 1;

  // Set background size (to avoid massive numbers when background position is increased)
  var bg = {
    x: 0,
    y: 0,
    W: 1500,
    H: 1500
  };

  /**
   *  @generator
   *  @function create_object creates a new object and appends to relevant array [objects, bandits, bonuses]
   */
  function create_object() {
    // Check that the number of objects currently existing isn't too high
    if (self.map.canvas && self.objects.length < MAX_OBJECT_COUNT) {
      // Create a random position for the generated object
      var position = new ObjectPosition(self.map.canvas, self.player.direction);

      // Random object type (70% chance of being a cactus, else a barrel)
      var obstacle_type = Math.random() < 0.7 ? images.cactus : images.barrels;

      // Generate object (in this case, static object for testing purposes)
      var random_object = new Obstacle(position.x, position.y, 80, obstacle_type);

      // Store object in array
      self.objects.push(random_object);
    }

    // Random delay for next object
    var delay = Math.random() * 1200;

    setTimeout(function () {
      return create_object();
    }, delay);
  };

  /**
   *  @generator
   *  @function create_bandit creates a new object and appends to relevant array [objects, bandits, bonuses]
   */
  function create_bandit() {
    // Check that the number of objects currently existing isn't too high
    if (self.map.canvas && self.bandits.length < MAX_BANDIT_COUNT) {
      // Create a random position for the generated object
      var position = new ObjectPosition(self.map.canvas, calc.random_direction());

      // Get angle between bandit and player
      var angle = calc.angle(position, {
        x: self.map.canvas.width / 2,
        y: self.map.canvas.height / 2
      });

      // Get speed for bandit (as touch-devices are slower)
      var BANDIT_SPEED = 8;

      // Create bandit
      var bandit = new Bandit(position.x, position.y, -angle, BANDIT_SPEED, 'bandit');

      // Store bandit in array
      self.bandits.push(bandit);
    }

    // Random delay for next object
    var delay = Math.random() * 1200;

    setTimeout(function () {
      return create_bandit();
    }, delay);
  };

  /**
   *  @generator
   *  @function create_explosion creates an explosion
   */
  function create_explosion(x, y) {
    self.explosions.push(new Explosion(x, y));
  };

  /**
   *  @function crash displays crash animation, removes a life from {Player} and performs soft reset
   */
  self.crash = function () {
    // Pause game
    self.paused = true;

    // Set game to unplayable whilst crash animation plays out
    playable = false;

    // Remove a life from the player
    self.player.lose_life();

    // Delay continuation of game
    setTimeout(function () {
      // If all lives are lost, perform a hard reset
      if (self.player.lives < 0) {
        gameplay.hard_reset(self, false);
        return false;
      }

      // Update the lives printed
      self.menu.print_lives(self.player.lives);

      // Reset objects
      gameplay.soft_reset(self, bg);

      // Make game playable again
      playable = true;

      // Re-draw the map
      render();
    }, 2000);
  };

  /**
   *  @function render renders keyframes to animate canvas
   */

  function render() {
    var map = self.map;
    var menu = self.menu;
    var canvas = self.map.canvas;
    var background = self.map.bg;
    var direction = calc.angleToLength(self.player.direction, self.player.moved);

    // Clear canvas
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Store variables for moving
    var moveX = Math.floor(direction[0]);
    var moveY = Math.floor(direction[1]);

    bg.x = bg.x - moveX;
    bg.y = bg.y - moveY;

    // Retain background X-position within bounds
    bg.x = bg.x > bg.W ? bg.x - bg.W : bg.x;
    bg.x = bg.x < -bg.W ? bg.x + bg.W : bg.x;

    // Retain background Y-position within bounds
    bg.y = bg.y > bg.H ? bg.y - bg.H : bg.y;
    bg.y = bg.y < -bg.H ? bg.y + bg.H : bg.y;

    // Plot new background onto canvas
    background.style.backgroundPositionX = bg.x + 'px';
    background.style.backgroundPositionY = bg.y + 'px';

    // Get player position
    var half_width = canvas.width / 2;
    var half_height = canvas.height / 2;

    // Move all obstacles by set amount
    self.objects.forEach(function (object, index) {
      object.update_position(moveX, moveY);
      object.collided(map.centerX, map.centerY, self);
      object.remove_old_objects(self.objects, canvas, index);
      object.draw(canvas.ctx);
    });

    /**
     *  Create a clone of all bandits present
     *  @returns {Array}
     */
    var all_bandits_clone = self.bandits.map(function (obj, index) {
      // Remove every bandit that has crashed
      if (obj.crashed) {
        self.bandits.splice(index, 1);
        gamearea.removeChild(obj.canvas);
        create_explosion(obj.x, obj.y);

        return false;
      }

      var clone = {
        x: obj.x,
        y: obj.y
      };

      return clone;
    });

    /**
     *  Loop through @param {Array} all_bandits_clone and apply relevant transforms
     */
    self.bandits.forEach(function (obj, index) {
      var bandit = obj;

      // Get key measures from bandit
      var this_bandit = {
        x: bandit.x,
        y: bandit.y
      };

      // Test whether bandit has collided with another bandit
      for (var other in all_bandits_clone) {
        if (other == index) continue;

        // Get bandit proximity
        var bandit_proximity = calc.distance(this_bandit, all_bandits_clone[other]);

        // Crash if proximity is within crash bounds
        if (bandit_proximity < bandit.collide_distance) bandit.crashed = true;
      }

      bandit.new_frame();
      bandit.update_position(moveX, moveY);
      bandit.chase({
        x: half_width,
        y: half_height
      });
      bandit.collided(map.centerX, map.centerY, self);
      bandit.hit_object(self.objects, index);
      bandit.remove_old_objects(self.bandits, canvas, index);
      bandit.draw(canvas.ctx);
    });

    // Draw explosions on screen (if necessary)
    if (self.explosions.length) {
      self.explosions.forEach(function (object, index) {
        object.update_position(moveX, moveY);
        object.new_frame(self.explosions, index);
        object.draw(canvas.ctx);
      });
    };

    // Draw player on screen
    self.player.new_frame();
    self.player.draw(canvas);

    // Update score accordingly
    self.player.score += 0.1;
    menu.print_score(parseInt(self.player.score));

    if (!self.paused) {
      window.requestAnimationFrame(render);
    }
  }

  /**
   *  @function start_game begins play or resumes if game is paused
   */

  function start_game(input) {
    self.is_touch = input == 'touch' ? true : false;

    // Start generating random obstacles
    create_object();

    // After a few seconds, start generating bandits
    setTimeout(function () {
      create_bandit();
    }, 3000);

    // Start the game
    if (playable && self.paused) {
      self.paused = false;
      window.requestAnimationFrame(render);
    }
  }

  /**
   *  Register primary touch/mouse events
   */
  self.map.canvas.addEventListener('mousedown', function () {
    return start_game('mouse');
  });
  self.player.joystick.addEventListener('touchstart', function () {
    return start_game('touch');
  });

  // Set game to playable
  playable = true;

  // Draw player for initial play
  self.player.draw(self.map.canvas);

  return self;
};

/**
 *  @function load
 *  Load assets and begin new game
 */

(function load() {
  var images = window.images.assets_to_load;
  var total = images.length;
  var loaded = 1;

  var load_output = document.createElement('span');
  var load_percent = document.createTextNode('0%');

  load_output.classList.add('loading');
  load_output.appendChild(load_percent);
  gamearea.appendChild(load_output);

  // Add load event handler for all images

  var _loop = function _loop(i) {
    // Check if image is loaded
    images[i].addEventListener('load', function () {
      loaded++;
      images.splice(i, 1);

      // Update 'loaded' amount
      load_percent.nodeValue = parseInt(100 * (loaded - 1) / total) + '%';
    });
  };

  for (var i = 0; i < images.length; i++) {
    _loop(i);
  };

  // Constantly poll loader until loading is complete
  (function check_progress() {
    if (loaded >= total) {
      window.gamearea.removeChild(load_output);
      window.play = new Game();
    } else {
      window.requestAnimationFrame(check_progress);
    }
  })();
})();