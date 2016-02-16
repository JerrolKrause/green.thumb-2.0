module.exports = {
    all: {
        files: [{
            expand: true,
            cwd: 'src/',
            src: ['images/**/*.*'],
            dest: 'dist/'
        }]
    }
};