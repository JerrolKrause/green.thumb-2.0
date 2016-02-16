module.exports = {
    options : {
         mangle: false
    },
    first_target: {
        files: {
            'dist/scripts/plugins.min.js': ['src/scripts/vendor/jquery-2.2.0.min.js','src/scripts/vendor/bootstrap.min.js','src/scripts/vendor/angular.min.js','src/scripts/vendor/angular-route.min.js','src/scripts/vendor/ui-bootstrap-tpls.min.js','src/scripts/vendor/moment.min.js','src/scripts/produce.js'],
            'dist/scripts/application.min.js': ['src/scripts/greenthumb.js', 'src/scripts/services/services.js', 'src/scripts/controllers/gt-garden.js', 'src/scripts/controllers/gt-interactive.js', 'src/scripts/controllers/gt-filter.js']
        }
    }
};