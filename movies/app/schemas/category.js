var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema({
	name: String,//分类名字
	movies: [{type: ObjectId, ref: 'Movie'}],
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

CategorySchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

CategorySchema.statics = {
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
module.exports = CategorySchema;