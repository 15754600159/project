var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
	// mongoose的关联特性 populate
	movie: {type: ObjectId, ref: 'Movie'},
	from: {type: ObjectId, ref: 'User'},
	reply: [{
		from: {type: ObjectId, ref: 'User'},
		to: {type: ObjectId, ref: 'User'},
		content: String
	}],
	content: String,
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

CommentSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

CommentSchema.statics = {
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
module.exports = CommentSchema;