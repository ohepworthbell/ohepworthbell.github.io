module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    indentation: [2],
    'selector-type-no-unknown': null,
    'at-rule-no-unknown': null,
    'unit-whitelist': ['em', 'rem', '%', 'px', 'vw', 'vh', 's', 'ms', 'deg', 'fr'],
    'no-descending-specificity': null
  }
};
