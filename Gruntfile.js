module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            client: {
                src: ['client/src/**/*.js'],
                dest: 'client/dist/carousel.js',
            },
        },

        'http-server': {
            'dev': {
                port: 8000
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('default', ['concat']);
    grunt.registerTask('build', ['concat']);
};
