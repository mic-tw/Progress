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
 	date: Date,
 	value: Number,
 	description: String
 });
 
 var Targets = new Schema({
 	user: String,
 	name: String,
 	description: String,
 	milestones: [MileStones],
 	progress: [Progress]
 });
 mongoose.model('Targets', Targets);
 
 exports.Targets = Targets; 
 
 mongoose.connect('mongodb://localhost/progress');