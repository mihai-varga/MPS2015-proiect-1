module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            client: {
                src: [
                    'client/src/Carousel.js',
                    'client/src/Class.js',
                    'client/src/Util.js',
                    'client/src/Player.js',
                    'client/src/Main.js'
                ],
                dest: 'client/dist/carousel.js'
            },
            server: {
                src: [
                    'server/src/Server.js',
                    'server/src/Player.js',
                    'server/src/Game.js',
                ],
                dest: 'server/dist/server.js'
            }
        },

        nodemon: {
            all: {
                script: 'server/dist/server.js',
                options: {
                    delayTime: 100,
                    exitcrash: true,
                    legacyWatch: true,
                    watch: ['server/dist/server.js']
                }
            }
        },

        mdlint: ['README.md'],

        'http-server': {
            'dev': {
                port: 8000
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['concat']);
    grunt.registerTask('build', ['concat']);
};
