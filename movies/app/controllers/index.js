// index page
var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req, res){
// 	path
// 　　类型：String或Object。
// 　　String类型的时， 指定要填充的关联字段，要填充多个关联字段可以以空格分隔。
// 　　Object类型的时，就是把 populate 的参数封装到一个对象里。当然也可以是个数组。下面的例子中将会实现。
	Category
		.find({})
		.populate({
			path: 'movies', 		//填充哪个字段
			select: 'title poster',  //用哪些信息填充
			options: {limit: 6}
		})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			
			res.render('index', {
				title: 'imooc 首页',
				categories: categories
			})
		})
	
}

// search page
exports.search = function(req, res){
	// 类别参数
	var catId = req.query.cat;
	var page = parseInt(req.query.p, 10)  || 0;
	var count = 2;
	var index = page * count;
	// 搜索框参数
	var q = req.query.q;

	if(catId){
		//点击类别进入
		Category
			.find({_id: catId})
			.populate({
				path: 'movies',           //填充哪个字段
				select: 'title poster', //用哪些信息填充
				// options: {limit: 2, skip: index}//skip是指定从那一条数据开始查
			})
			.exec(function(err, categories){
				if(err){
					console.log(err);
				}
				// console.log(categories);
				// console.log(categories[0].movies);
				// 自定义限制数量和翻页
				var category = categories[0] || {};
				var movies = category.movies || {};
				var results = movies.slice(index, index + count);
				res.render('results', {
					title: 'imooc 结果列表页',
					keyword: category.name,
					movies: results,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					query: 'cat=' + catId //为result页面翻页提供参数
				})
			})
	}else{
		// 点击搜索进入
		Movie
			.find({title: new RegExp(q + '.*', 'i')})//正则实现模糊查询
			.exec(function(err, movies){
				if(err){
					console.log(err);
				}
			
				var results = movies.slice(index, index + count);
				res.render('results', {
					title: 'imooc 结果列表页',
					keyword: q,
					movies: results,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					query: 'q=' + q //为result页面翻页提供参数
				})
			})
	}
	
}
