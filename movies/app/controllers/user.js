// sign up注册
// 几种获取参数方式总结
//  1./user/signup/:userid   req.params.userid
//  2./user/signup/111?userid=1123   req.query.userid
//  3.表单post方式   req.body.userid
// req.param('userid') 是express对以上三种方法的合并 取的优先级1->3->2
var User = require('../models/user');

exports.signup = function(req, res){
	var _user = req.body.user;

	User.findOne({name: _user.name}, function(err, user){
		if(err) {
			cosnole.log(err);
		}

		if(user){
			// 如果用户的注册名已存在，就跳转到登录页面
			return res.redirect('/signin');
		}else{
			var user = new User(_user);
			user.save(function(err, user){
				if(err){
					console.log(err);
				}

				res.redirect('/');
			})
		}
	})
}

exports.showSignup = function(req, res){
		
	res.render('signup', {
		title: '注册页面',
	})
}


// sign in 登录
exports.signin = function(req, res){
	// console.log(req.body)
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: name}, function(err, user){
		if(err){
			console.log(err);
		}

		if(!user){
			// 如果用户的登录名不存在，就跳转到注册页面
			return res.redirect('/signup');
		}

		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err);
			}

			// console.log(isMatch);
			if(isMatch){
				// console.log('password is match!');
				req.session.user = user;
				return res.redirect('/');
			}else{
				console.log('password is not matched');
				// 密码不对，转到登录页面
				return res.redirect('/signin');
			}
		})
	})
}
exports.showSignin = function(req, res){
		
	res.render('signin', {
		title: '登录页面',
	})
}

// 登出
exports.logout = function(req, res){
	delete req.session.user;
	// /delete app.locals.user;
	res.redirect('/');
}



// userlist page 
exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}
		
		res.render('userlist', {
			title: 'imooc 用户列表页',
			users: users
		})
	})
}


// 权限管理
// midware for user signin 是否登录
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	console.log(user)
	if(!user){
		return res.redirect('/signin');
	}

	next();
}

// midware for user admin 是否有管理员权限
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	if(user.role <= 10){
		return res.redirect('/signin');
	}

	next();
}