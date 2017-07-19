var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');

var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
var fs = require('fs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// 数据库名字指定imooc (127.0.0.1换成localhost会报错,有bug)
mongoose.connect('mongodb://127.0.0.1/imooc');
// 集合名的指定可以参考http://www.cnblogs.com/wx1993/p/5243245.html

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);

			if(stat.isFile()){			//如果是文件
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath);
				}
			}else if(stat.isDirectory()){//如果是文件夹
				walk(newPath);
			}
		})
}
walk(models_path);


//时间处理
// 在app.locals这个对象字面量中定义的键值对，是可以直接在模板中使用的，就和res.render时开发者传入的模板渲染参数一样
// 详细参考http://cnodejs.org/topic/57a5b34300bb7f2c700c7b9c
app.locals.moment = require('moment');

// session 最近的版本已经不需要依赖cookie-parser
// app.use(express.cookieParser());
app.use(session({
	secret: 'imooc',
	store: new MongoStore({
		url: 'mongodb://127.0.0.1/imooc',
		collection: 'sessions', 
	})
}))


// 开发环境的调试信息配置
if('development' === app.get('env')){
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	// 网站源代码正常显示
	app.locals.pretty = true;
	// 数据库调试信息
	mongoose.set('debug', true);
}
// 表单文件上传
app.use(require('connect-multiparty')());
// 视图路径、类型
app.set('views', './app/views/pages');
app.set('view engine', 'jade');

// 格式化表单提交数据
// 参考：http://www.tuicool.com/articles/beEJ32a
app.use(bodyParser.urlencoded({ extended: true  }));
// 静态资源路径
app.use(serveStatic(path.join(__dirname, 'public')));

// 引入路径文件
require('./config/routes')(app);

app.listen(port);

console.log('imooc started on port' + port);


