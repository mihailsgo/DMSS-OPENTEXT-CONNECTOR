// Placeholder for the build target file; the name must be the same,
// include public modules from this component
require(['require', 'css'], function (require, css) {

  // Load the bundle-specific stylesheet
  css.styleLoad(require, 'dmss/bundles/dmss-all');

});
