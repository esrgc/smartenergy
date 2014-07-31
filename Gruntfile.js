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
    concat: {
      options: {
        separator: ';',
      },
      js: {
        src: ['public/js/*.js'],
        dest: 'public/js/min/<%= pkg.name %>.js'
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
      browserify: {
        files: ['public/js/*.js'],
        tasks: ['bump', 'browserify', 'uglify']
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['bump', 'less', 'browserify', 'uglify', 'watch']);
  grunt.registerTask('deploy', ['less', 'browserify', 'uglify']);

};