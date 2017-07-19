var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
// 电影信息替换
var _ = require('underscore');
// 海报上传
var fs = require('fs');
var path = require('path');


// detail page 
exports.detail = function(req, res){
	var id = req.params.id;

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
		if(err){
			console.log(err);
		}
	})
	Movie.findById(id, function(err, movie){
		Comment
			.find({movie: id})
			.populate('from', 'name')//在from对象里增加了name属性，关联查询到了名字
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments){
				// console.log(movie)
				console.log(comments)
				res.render('detail', {
					title: 'imooc 详情页',
					movie: movie,
					comments: comments
				})
			})
	})
}

// admin page 新增一条记录
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: 'imooc 后台录入页',
			categories: categories,
			movie: {
				title: '',
				doctor: '',
				country: '',
				year: '',
				poster: '',
				flash: '',
				summary: '',
				language: ''
			}
		})
	})
} 

// admin update movie 修改一条记录
exports.update = function(req, res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories,
				})
			})
		})
	}
}


// admin movie poster save海报存储
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	if(originalFilename){//若果有文件名，就认为上传了海报
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

			fs.writeFile(newPath, data, function(err){
				req.poster = poster;//传到下一环节
				next();
			})
		})
	}else{
		// 没有海报上传
		next();
	}
}



// admin post movie
exports.save = function(req, res){
	// 参考http://www.expressjs.com.cn/4x/api.html     搜索.body
	// console.log(req.body.movie._id);
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(req.poster){//接上一中间件savePoster的poster参数
		movieObj.poster = req.poster;
	}

	if(id){
		// 电影信息更新
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			
			// 调用了开头引入的underscore模块
			// extend_.extend(destination, *sources) 
			// 复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象. 复制是按顺序的, 所以后面的对象属性
			// 会把前面的对象属性覆盖掉(如果有重复).
			// _.extend({name: 'moe'}, {age: 50});
			// => {name: 'moe', age: 50}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				// 保存（更新）成功后页面跳转到对应的详情页
				res.redirect('/movie/' + movie._id)
			})
		})
	}else{
		// 新加电影信息
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function(err, movie){
			// console.log(_movie)
			if(err){
				console.log(err);
			}

			if(categoryId){				//已有分类下新加电影
				Category.findById(categoryId, function(err, category){
					category.movies.push(movie._id);

					category.save(function(err, category){
						// console.log('/movie/' + movie._id)
						// 保存（更新）成功后页面跳转到对应的详情页
						res.redirect('/movie/' + movie._id);
					})
				})
			}else if(categoryName){		//新增分类，再新加电影
				var category = new Category({
					name: categoryName,
					movies: [movie._id],
				})

				category.save(function(err, category){
					movie.category = category._id;
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id);
					})
				})
			}
		})
	}
}


// list delete movie 删除一条数据
exports.del = function(req, res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		})
	}
}


// list page 
exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	})
}