module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                files: {
                    'public/js/base.js': [
                        'src/util/zepto.min.js',
                        'src/util/zepto.fx.js',
                        'src/util/jquery.lettering.js',
                        'src/util/name_space.js',
                        'src/util/conf.js',
                        'src/util/api.js',
                        'src/util/get_init_info.js'
                    ]
                }
            }
        },
        //sass: {
        //    dist: {
        //        files: {
        //            'statics/css/phone.css': 'statics/sass/phone.scss',
        //            'statics/css/style.css': 'statics/sass/style.scss'
        //        }
        //    }
        //},
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    'public/css/phone.min.css': [
                        "statics/stylesheets/phone.css"
                    ],
                    'public/css/style.min.css': [
                        "statics/stylesheets/style.css"
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-sass');
    // 默认任务
    grunt.registerTask('default', ['uglify','cssmin']);
}