module.exports = {
    options: {
        spawn: false,
        livereload: {
            host: 'localhost',
            port: 8080
        }
    },
    scripts: {
        files: [
            'src/scripts/*.js',
            'src/scripts/controllers/*.js',
            'src/scripts/services/*.js'
        ],
        tasks: [
            'uglify'
        ]
    },
    styles: {
        files: [
            'src/styles/*.scss'
        ],
        tasks: [
            'sass:dev'
        ]
    }
};