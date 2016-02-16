module.exports = {
    // Development settings
    dev: {
        options: {
            outputStyle: 'compressed',
            sourceMap: true
        },
        files: [{
            expand: true,
            cwd: 'src/styles',
            src: ['*.scss','*.css'],
            dest: 'dist/styles',
            ext: '.css'
        }]
    },
    // Production settings
    prod: {
        options: {
            outputStyle: 'compressed',
            sourceMap: false
        },
        files: [{
            expand: true,
            cwd: 'src/styles',
            src: ['*.scss','*.css'],
            dest: 'dist/styles',
            ext: '.css'
        }]
    }
};