module.exports = function(grunt) {
  "use strict";
  
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    licence: grunt.file.read("license_header.txt"),
 
    uglify: {
      options: {
        banner: "/*\n<%= pkg.name %> v<%= pkg.version %> \n\n<%= licence %>*/\n",
        preserveComments: "some"
      },
      build: {
        src: [
          "js/box.js",
          "js/player.js",
          "js/platform.js",
          "js/message.js",
          "js/climb.js"
        ],
        dest: "production/js/<%= pkg.name %>.min.js"
      }
    },
    jshint: {
      options: {
        eqeqeq: true,
        undef: true,
        unused: true,
        strict: true,
        indent: 2,
        immed: true,
        latedef: "nofunc",
        newcap: true,
        nonew: true,
        trailing: true,
        globals: {
          oFactory: true,
          tgame: true,
          createBox: true,
          createPlayer: true,
          createPlatform: true,
          createMessage: true
        }
      },
      grunt: {
        options: {
          node: true
        },
        src: "Gruntfile.js"
      },
      src: {
        options: {
          browser: true
        },
        src: "<%= uglify.build.src %>",
      },
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("build", ["jshint", "uglify"]);

  grunt.registerTask("default", ["jshint"]);
};