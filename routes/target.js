
/*
 * GET users listing.
 */

 var mongoose = require('mongoose')
 	, Targets = mongoose.model('Targets')
 	, util = require('util');

 var addTarget = function(req, res, next){
 	new Targets({
 		user: req.params.user,
 		name: req.body.target_name,
 		description: req.body.target_description,
 		milestones: [{
 			name: req.body.step1_name || req.body.target_name,
 			description: req.body.step1_description || req.body.target_description,
 			value: req.body.step1_value,
 			date: req.body.step1_date
 		}]
 	}).save(function(err, target){
 		console.log('addTarget');
 		if(err){
 			return next(err);
 		}
 		util.inspect(target, false, 4);
 		res.send(target);
 	});
 };
 
 var listTargets = function(req, res, next){
 	var query = Targets.find();
 	if(req.params.user){
 		query.find({user: req.params.user});
 	}
 	query.exec(function(err, targets){
 		console.log('listTargets');
 		if(err){
 			return next(err);
 		}
 		util.inspect(targets, false, 4);
 		res.render('targets', {
 			userName: req.params.user,
 			user: req.params.user,
 			targets: targets,
 			title: 'Progress'
 		});
 	});
 };

exports.list = listTargets;
exports.add = addTarget;