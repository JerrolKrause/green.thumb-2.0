module.exports = {
    copy: {
            files: [
                // includes files within path
                {expand: true, src: ['src/fonts/**'], dest: 'dist/fonts', flatten: true, filter: 'isFile'}
            ]
    }
};