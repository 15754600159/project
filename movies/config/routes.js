var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
// 电影信息替换
var _ = require('underscore');


module.exports = function(app){


	//pre handle user 让每个页面都能获取user信息
	app.use(function(req, res, next){
		var _user = req.session.user;
		app.locals.user = _user;

		next();
	}) 



// 首页
	// index page
	app.get('/', Index.index);




// User
	// sign up注册
	app.post('/user/signup', User.signup);
	app.get('/signup', User.showSignup);
	// sign in 登录
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	// 登出
	app.get('/logout', User.logout);
	// userlist page (中间件: 是否登录   是否有管理员权限)
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);




// Movie
	// detail page 详情页
	app.get('/movie/:id', Movie.detail);
	// admin page 新增
	app.get('/admin/movie/new',User.signinRequired, User.adminRequired,  Movie.new);
	// admin update movie 修改
	app.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired,  Movie.update);
	// admin post movie（这个不是直接访问的，而是以上两个新增或修改点提交，再连接到这个地址的）
	app.post('/admin/movie',User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
	// list page 
	app.get('/admin/movie/list',User.signinRequired, User.adminRequired,  Movie.list);
	// list delete movie 删除一条数据
	app.delete('/admin/movie/list',User.signinRequired, User.adminRequired,  Movie.del);



// Comment
	app.post('/user/comment',User.signinRequired, Comment.save);


// Category
	// 新建一个电影分类页面get
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	// 新建一个电影分类页面post
	app.post('/admin/category',User.signinRequired, User.adminRequired,  Category.save);
	// category list 页面
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);



// results
	app.get('/results', Index.search);

	
	
}
