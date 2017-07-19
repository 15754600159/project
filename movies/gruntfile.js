module.exports = function(grunt){

	// 1.任务配置
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					// 文件改变，重新启动服务
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// 语法检查
				// tasks: ['jshint'],
				options: {
					// 文件改变，重新启动服务
					livereload: true
				}
			}
		},

		// 文件被改变时用于重启服务
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		// 让以上两个模块配合
		concurrent: {
			task: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		// 单元测试
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},
	})


	// 2.加载任务所需插件
	// 监听文件修改
	grunt.loadNpmTasks('grunt-contrib-watch');
	// 重启服务
	grunt.loadNpmTasks('grunt-nodemon');
	//慢任务，辅助以上两个的执行？？？
	grunt.loadNpmTasks('grunt-concurrent');
	// 单元测试
	grunt.loadNpmTasks('grunt-mocha-test');



	// 让grunt警告的时候不暂停任务
	grunt.option('force', true);
	// 3. 默认被执行的任务列表
	grunt.registerTask('default', ['concurrent']);

	// test 跑不起来 找不到相关模块。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
	grunt.registerTask('test', ['mochaTest']);
}