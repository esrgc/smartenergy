module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false
      }
    },
    handlebars: {
      compile: {
        options: {
          commonjs: true,
          namespace: false,
          processName: function(filePath) {
            return filePath.replace(/^public\/js\/templates\//, '').replace(/\.hbs$/, '');
          }
        },
        files: {
          'public/js/modules/templates.js': 'public/js/templates/*.hbs'
        }
      }
    },
    less: {
      options: {
        compress: true
      },
      dist: {
        files: {
          'public/css/<%= pkg.name %>.css': ['public/css/style.less']
        }
      }
    },
    browserify: {
      options: {
        bundleOptions: { debug: true }
      },
      dev: {
        src: 'public/js/index.js',
        dest: 'public/js/min/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true
      },
      build: {
        src: 'public/js/min/<%= pkg.name %>.js',
        dest: 'public/js/min/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      options: {
        spawn: false,
      },
      browserify: {
        files: ['public/js/modules/**/*.js'],
        tasks: ['bump', 'browserify', 'uglify'],
      },
      css: {
        files: 'public/css/*.less',
        tasks: ['bump', 'less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['bump', 'less', 'handlebars', 'browserify', 'uglify', 'watch']);
  grunt.registerTask('prod', ['less', 'handlebars', 'browserify', 'uglify']);

};