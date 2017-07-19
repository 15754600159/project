var Category = require('../models/category');


// admin page 新增一条记录
exports.new = function(req, res){
	res.render('category_admin', {
		title: 'imooc 后台分类录入页',
		category: {
			name: '',
		}
	})
} 


// admin post category
exports.save = function(req, res){
	// 参考http://www.expressjs.com.cn/4x/api.html     搜索.body
	// console.log(req.body.movie._id);
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err, category){
		if(err){
			console.log(err);
		}

		// 保存（更新）成功后页面跳转到列表页
		res.redirect('/admin/category/list');
	})
}


// categorylist page 
exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err);
		}
		
		res.render('categorylist', {
			title: 'imooc 电影分类列表页',
			categories: categories,
		})
	})
}