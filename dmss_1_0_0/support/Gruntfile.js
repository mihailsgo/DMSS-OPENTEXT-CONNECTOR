// Builds debug and release package files for the product

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function (grunt) {

  // Report the duration of the tasks run
  require('time-grunt')(grunt);

  var
  // Path to the csui sources
      csuiPath = '../lib/src/csui',
  // Path to the custom grunt tasks exposed by the CS UI Widgets
      csuiGruntTasks = path.join(csuiPath, '/grunt-tasks'),
  // RequireJS modules packed into the product bundles
      requirejsModules = [
        {
          name: 'bundles/dmss-all',
          exclude: [ 'css', 'csui-ext', 'hbs', 'i18n', 'json', 'less', 'txt' ]
        }
      ];

  // Declare tasks for the build from sources
  grunt.initConfig({

    // Set up desktop grunt result notifications
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: 'dmss/src',
        success: true,
        duration: 3
      }
    },

    // Extract bundles index to csui-index.js and csui-index.json files
    requirejsBundleIndex: {
      all: {
        src: [
          'bundles/dmss-all.js'
        ],
        dest: 'bundles/dmss-index',
        options: {
          prefix: 'dmss'
        }
      }
    },

    // Check if bundle indexes refer to distinct collection of modules
    requirejsBundleCheck: {
      all: {
        options: {
          prefix: 'dmss',
          dependencies: requirejsModules,
          config: require('./config-build.json')
        }
      }
    },

    // Copy, uglify and combine RequireJS modules to file bundles
    requirejs: {

      debug: {
        options: {
          mainConfigFile: 'config-build.js',
          namespace: 'csui',
          separateCSS: true,
          appDir: '.',
          baseUrl: '.',
          siteRoot: '.',

          dir: '../out-debug',
          optimize: 'none',

          modules: requirejsModules
        }
      },

      release: {
        options: {
          mainConfigFile: 'config-build.js',
          namespace: 'csui',
          separateCSS: true,
          appDir: '.',
          baseUrl: '.',
          siteRoot: '.',

          dir: '../out-release',
          compressCSS: true,
          optimize: 'uglify2',
          uglify2: {
            output: {
              // Workaround for IE, which fails parsing JavaScript with Unicode.  The
              // select2 component uses keys with diacritics and IIS does not send
              // the UTF-8 charset in the Content-Type header for the *.js files.
              ascii_only: true,
              quote_keys: true
            }
          },
          generateSourceMaps: true,
          preserveLicenseComments: false,

          modules: requirejsModules
        }
      }

    },

    // Perform static code correctness checks
    jshint: {
      all: [
        './**/*.js',
        '../test/*.js'
      ],
      options: {
        jshintrc: '../.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Perform a format check on the concatenated and minified
    // JavaScript files
    eslint: {
      debug: [
        '../out-debug/bundles/*.js'
      ],
      release: [
        '../out-release/bundles/*.js'
      ]
    },

    // Check correct format of the CSS source files
    csslint: {
      source: {
        options: {
          csslintrc: '../.csslintrc'
        },
        src: ['**/*.css']
      },
      debug: {
        options: {
          csslintrc: '../.csslintrc-output'
        },
        src: ['../out-debug/**/*.css']
      },
      release: {
        options: {
          csslintrc: '../.csslintrc-output'
        },
        src: ['../out-release/**/*.css']
      }
    },

    // Check correct format of the JSON source files
    jsonlint: {
      source: [
        '**/*.json'
      ],
      debug: [
        '../out-debug/*.json'
      ],
      release: [
        '../out-release/*.json'
      ]
    },

    // Perform static code correctness checks but do not fail;
    // this is used in test runner, which may use ddescribe and
    // iit methods, which should not be allowed in normal build
    override: {
      jshint: {
        options: {
          force: true
        }
      }
    },

    // Remove files and directories from the output which are not distributed
    clean: {

      generated: [
        'bundles/*-index.*'
      ],

      debug: {
        files: [
          {
            expand: true,
            src: [
              '*', '!dmss-extensions.json', '!bundles',
              'bundles/*.src.js',
              'commands',
              'controls',
              'integration',
              'widgets'
            ].map(function (path) {
              if (path[0] === '!') {
                return '!../out-debug/' + path.substring(1);
              }
              return '../out-debug/' + path;
            })
          }
        ]
      },

      release: {
        files: [
          {
            expand: true,
            src: [
              '*', '!dmss-extensions.json', '!bundles',
              'bundles/*.src.js',
              'commands',
              'controls',
              'integration',
              'widgets'
            ].map(function (path) {
              if (path[0] === '!') {
                return '!../out-release/' + path.substring(1);
              }
              return '../out-release/' + path;
            })
          }
        ]
      },

      options: {
        // Enable cleaning files outside the project root
        force: true
      }

    },

    // Replaces the build number in the dmss extension-describing file,
    // if provided by the process environment, otherwise leave the number
    // in the source file
    replace: {
      options: {
        force: true,
        patterns: process.env.BUILD ? [
          {
            match: /"version": "[.0-9]+"/g,
            replacement: '"version": "' + process.env.BUILD + '"'
          }
        ] : []
      },
      debug: {
        files: [
          {
            src: ['dmss-extensions.json'],
            dest: '../out-debug/dmss-extensions.json'
          }
        ]
      },
      release: {
        files: [
          {
            src: ['dmss-extensions.json'],
            dest: '../out-release/dmss-extensions.json'
          }
        ]
      }
    },

    // Copies the stylesheets and related files to a single directory,
    // so that it can be used as a template for a custom styling
    copy: {

      theme: {
        files: [
          // Stylesheets for the csui bundles
          {
            cwd: '../out-debug/',
            src: ['bundles/*.css'],
            dest: '../out-custom_theme/dmss/',
            expand: true,
            filter: 'isFile'
          }
        ]
      },

      module: {
        files: [
          {
            cwd: "../srcmodules/dmss",
            src: "**",
            dest: "../out-module/dmss",
            expand: true
          },
          {
            cwd: "../out-release",
            src: "**",
            dest: "../out-module/dmss/support",
            expand: true
          }
        ]
      }



    },

    // Generate bundles of concatenated i18n modules in the default language
    // (English, locale'root') prepared for localization to other languages
    languagepack: {
      all: {
        options: {
          prefix: 'dmss',
          config: require('./config-build.json'),
          bundlesInfo: requirejsModules,
          bundleIndexes: {
            'bundles/dmss-index': ['bundles/dmss-all']
          },
          outputDir: '../out-languagepack_en'
        }
      }
    }

  });

  // Load all grunt plugins from the package directory for simplicity;
  // not only the tasks really needed by the this Gruntfile
  grunt.loadTasks('../node_modules/grunt-subgrunt/tasks');
  grunt.loadTasks('../node_modules/grunt-notify/tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-requirejs/tasks');
  grunt.loadTasks('../node_modules/grunt-jsonlint/tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-jshint/tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-csslint/tasks');
  grunt.loadTasks('../node_modules/grunt-eslint/tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-copy/tasks');
  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');
  grunt.loadTasks('../node_modules/grunt-replace/tasks');
  grunt.loadTasks('../node_modules/grunt-override-config/tasks');

  // Load private tasks, which are maintained by our team
  grunt.loadTasks(csuiGruntTasks);

  // Define the order of tasks to build debug and release targets; make sure
  // that static code checks are performed too
  grunt.registerTask('check', ['jshint', 'jsonlint:source', 'csslint:source']);
  grunt.registerTask('debug', ['check', 'requirejsBundleIndex',
    'requirejs:debug', 'clean:generated', 'clean:debug',
    'languagepack', 'copy:theme', 'replace:debug',
    'eslint:debug', 'jsonlint:debug', 'csslint:debug']);
  grunt.registerTask('release', ['check', 'requirejsBundleIndex',
    'requirejs:release', 'requirejsBundleCheck', 'clean:generated',
    'clean:release', 'replace:release', 'eslint:release', 'jsonlint:release',
    'csslint:release', 'copy']);

  // Allow running just "grunt" in this directory to build both debug and
  // release targets
  grunt.registerTask('default', ['debug', 'release']);

  // Register desktop notification hooks
  grunt.task.run('notify_hooks');

};
