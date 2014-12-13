module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'index.html': 'src/index.html'
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/main.min.css': 'src/scss/main.scss'
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'js/main.min.js': ['src/js/plugins.js', 'src/js/main.js']
        }
      }
    },
    watch: {
      html: {
        files: 'src/**.html',
        tasks: ['htmlmin']
      },
      css: {
        files: 'src/scss/**.scss',
        tasks: ['sass']
      },
      scripts: {
        files: 'src/js/**.js',
        tasks: ['uglify']
      }
    }
  });
  // Default task(s).
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);



};