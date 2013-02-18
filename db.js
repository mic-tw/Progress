/**
 * New node file
 */

 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 var ObjectId = Schema.ObjectId;
 
 var MileStones = new Schema({
 	name: String, 
 	description: String,
 	value: Number, 
 	date: Date
 });
 
 var Progress = new Schema({
	uuid: String,
 	date: Date,
 	value: Number,
 	description: String
 });
 
 var Targets = new Schema({
	uuid: String,
 	user: String,
 	name: String,
 	description: String,
 	milestones: [MileStones],
 	progress: [Progress]
 });
 Targets.methods.newProgress = function(progress, callback){
	this.progress.push(progress);
	return this.save(callback);
 };
 Targets.methods.removeProgress = function(uuid, callback){
	var dirty = false;
	for(var i = 0 ; this.progress && i < this.progress.length ; i++){
		if(this.progress[i].uuid == uuid){
			this.progress[i].remove();
			dirty = true;
		}
	}
	if(dirty){
		return this.save(callback);
	}
 }
 mongoose.model('Targets', Targets);
 
 exports.Targets = Targets; 
 
 mongoose.connect('mongodb://localhost/progress');
