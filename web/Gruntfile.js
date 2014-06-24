module.exports = function(grunt) {

  grunt.initConfig({
    /* Should not be used in production */
    'http-server': {
      dev: {
        root: 'static',
        port: 4041,
        host: 'localhost',
        runInBackground: true
      }
    },

    browserify: {
      client: {
        files: {
          'static/scripts/app.js': ['client/scripts/app.ls']
        },
        options: {
          transform: ['liveify'],
          debug: true
        }
      }
    },

    sass: {
      dist: {
        files: [{
          'static/styles/index.css': 'client/styles/index.scss'
        }]
      }
    },

    watch: {
      ls: {
        files: 'client/scripts/**/*.ls',
        tasks: ['browserify'],
        options: {
          livereload: true
        }
      },
      scss: {
        files: 'client/styles/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['static/**/*.html'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('build', ['browserify', 'sass']);
  grunt.registerTask('default', ['http-server', 'build', 'watch']);
};
