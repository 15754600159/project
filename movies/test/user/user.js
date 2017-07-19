var bcrypt = require('bcryptjs');//密码加密
var crypto = require('crypto');

function getRandomString(len){
	if(!len) var len = 16;

	return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
// var User = require('../../app/models/user');
var User = mongoose.model('User');

// test（test之间可以嵌套）
describe('<Unit Test', function(){
	describe('Model User', function(){
		before(function(done){
			user={
				name: getRandomString(),
				password: 'password',
			};
			done();
		})

		describe('Before method save', function(){
			it('should begin without test user', function(done){
				User.find({name: user.name}, function(err, user){
					user.should.have.length(0);

					done();
				})
			})
		})

		describe('User save', function(){
			// 一个it，一个用例
			it('should save without problems', function(done){
				var _user = new User(user);

				_user.save(function(err){
					should.not.exist(err);
					//跑完test即删除user实例
					_user.remove(function(err){
						should.not.exist(err);
						done();//每个it中都要有done();
					})
				})
			})

			it('should password be hashed(加密) correctly', function(done){
				var password = user.password;
				var _user = new User(user);

				_user.save(function(err){
					should.not.exist(err);
					_user.password.should.not.have.length(0);
					bcrypy.compare(password, _user.password, function(err, isMatch){
						should.not.exist(err);
						isMatch.should.equal(true);
						//跑完test即删除user实例
						_user.remove(function(err){
							should.not.exist(err);
							done();
						})
					})
				})
			})

			it('new user should have default role(权限) 0', function(done){
				var _user = new User(user);

				_user.save(function(err){
					should.not.exist(err);
					_user.role.should.equal(0);
					//跑完test即删除user实例
					_user.remove(function(err){
						done();
					})
				})
			})

			it('should fail to save an existing user', function(done){
				var _user1 = new User(user);
				_user1.save();

				var _user2 = new User(user);
				_user2.save(function(err){
					should.exist(err);

					_user1.remove(function(err){
						if(!err){
							_user2.remove(function(err){
								done();
							})
						}
					})
				});
			})


		})


	})
})