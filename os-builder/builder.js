'use strict';

/**
 * This module is used to load the base KSS builder class needed by this builder
 * and to define any custom CLI options or extend any base class methods.
 *
 * Note: since this builder wants to extend the KssBuilderBaseTwig class, it
 * must export a KssBuilderBaseTwig sub-class as a module. Otherwise, kss-node
 * will assume the builder wants to use the KssBuilderBaseHandlebars class.
 *
 * This file's name should follow standard node.js require() conventions. It
 * should either be named index.js or have its name set in the "main" property
 * of the builder's package.json. See
 * http://nodejs.org/api/modules.html#modules_folders_as_modules
 *
 * @module kss/builder/twig
 */

const Attributes = require('drupal-attribute');

// We want to extend kss-node's Twig builder so we can add options that
// are used in our templates.
let KssBuilderBaseTwig;

try {
  // In order for a builder to be "kss clone"-able, it must use the
  // require('kss/builder/path') syntax.
  KssBuilderBaseTwig = require('kss/builder/base/twig');
} catch (e) {
  // The above require() line will always work.
  //
  // Unless you are one of the developers of kss-node and are using a git clone
  // of kss-node where this code will not be inside a "node_modules/kss" folder
  // which would allow node.js to find it with require('kss/anything'), forcing
  // you to write a long-winded comment and catch the error and try again using
  // a relative path.
  KssBuilderBaseTwig = require('../base/twig');
}

/**
 * A kss-node builder that takes input files and builds a style guide using Twig
 * templates.
 */
class KssBuilderTwig extends KssBuilderBaseTwig {
  /**
   * Create a builder object.
   */
  constructor() {
    // First call the constructor of KssBuilderBaseTwig.
    super();

    // Then tell kss which Yargs-like options this builder adds.
    this.addOptionDefinitions({
      'title': {
        group: 'Style guide:',
        string: true,
        multiple: false,
        describe: 'Title of the style guide',
        default: 'KSS Style Guide'
      }
    });
  }

  /**
   * Overwrites buildGuide
   *
   * We overwrite the buildGuide function so we can alter the options passed.
   * This allows us to change the template render function and inject the
   * attributes object.
   */
  buildGuide(styleGuide, options) {
    const renderTemplate = options.templateRender;

    options.templateRender = function (template, context) {
      context = addAttributesObject(template, context);

      return renderTemplate(template, context);
    };

    return super.buildGuide(styleGuide, options);
  }
}

/**
 * Adds an attributes object to the context of a template render.
 *
 * The attributes object implements the interface of the Drupal Attributes class.
 *
 * @param template
 *   The template the context will be used on.
 * @param context
 *   The current context object.
 *
 * @return object
 *   The modified context object
 */
function addAttributesObject(template, context) {
  context.attributes = new Attributes();

  // Tell twig not to escape the output of the attributes object.
  context.attributes.twig_markup = true;

  return context;
}

module.exports = KssBuilderTwig;