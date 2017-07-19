var mongoose = require('mongoose');
// 密码加密   加盐
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;//计算强度

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String,
	},
	password: String,
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type:Date,
			default: Date.now()
		}
	}
})

UserSchema.pre('save', function(next){
	var user = this;

	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);

			user.password = hash;
			next();
		})
	})
})

// 实例方法
UserSchema.methods = {
	comparePassword: function(_password, callback){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err) return callback(err);

			// console.log(isMatch)
			callback(null, isMatch);
		})
	}
}

// 静态方法
UserSchema.statics = {
	fetch: function(callback){
		return this
				.find({})
				.sort('meta.updateAt')
				.exec(callback)
	},
	findById: function(id, callback){
		return this
				.findOne({_id: id})
				.exec(callback)
	}
}

// 导出模块
module.exports = UserSchema;