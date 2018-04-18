// 包装函数
module.exports = function(grunt) {
 
  // 任务配置,所有插件的配置信息
  grunt.initConfig({

    //获取 package.json 的信息
    pkg: grunt.file.readJSON('package.json'),
    
    // uglify插件的配置信息
    uglify: {
      options: {
        stripBanners: true,
        banner: '/*! <%=pkg.name%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/Js/<%=pkg.name%>.js',
        dest: 'dist/Js/<%=pkg.name%>.min.js'
      }
    },

    //less插件的配置信息
    less: {
      editor: {
        src: 'src/Css/<%=pkg.name%>.less',
        dest: 'src/Css/<%=pkg.name%>.css'
      }
    },

    //cssmin插件的配置信息
    cssmin: {
      options: {
        stripBanners: true,
        banner: '/*! <%=pkg.name%>.css <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/Css/<%=pkg.name%>.css',
        dest: 'dist/Css/<%=pkg.name%>.min.css'
      }
    },

    //jshint插件的配置信息'
    jshint:{
      build: [ 'Gruntfile.js', 'src/Js/*.js' ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    //concat插件的配置信息
    concat: {
      css:{
        src: 'src/Css/parts/*.less',
        dest: 'src/Css/<%=pkg.name%>.less'
      },
      js:{
        src: 'src/Js/parts/*.js',
        dest: 'src/Js/<%=pkg.name%>.js'
      }
    },

    //copy插件的配置信息
    copy: {
      main: {
        files:[
          //js
          {
            expand: true, 
            flatten: true,
            src: ['src/Js/*.js'], 
            dest: 'dist/Js/', 
            filter: 'isFile'
          },
          //less
          {
            expand: true, 
            flatten: true,
            src: ['src/Css/*.less'], 
            dest: 'dist/Css/', 
            filter: 'isFile'
          },
          //css
          {
            expand: true, 
            flatten: true,
            src: ['src/Css/*.css'], 
            dest: 'dist/Css/', 
            filter: 'isFile'
          }
        ]
      }
    },

    // watch插件的配置信息
    watch: { 
      js: { 
        files: [
          'src/Js/parts/*.js'
        ], 
        tasks: [
          'concat', 
          'jshint', 
          'uglify',
          'copy'
        ], 
        options: { spawn: false}
      },
      css:{
        files: [
          'src/Css/parts/*.less'
        ], 
        tasks: [
          'concat', 
          'less', 
          'cssmin',
          'copy'
        ], 
        options: { spawn: false}
      }
    }

  });
 
  // 告诉grunt我们将使用插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  // 告诉grunt当我们在终端中输入grunt时需要做些什么（注意先后顺序）
  grunt.registerTask('default', [
    //注意下面注册任务时的前后顺序
    'concat',
    'less',
    'jshint', 
    'uglify', 
    'cssmin',
    'copy',
    'watch'
  ]);
 
};