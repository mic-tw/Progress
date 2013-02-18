
/*
 * GET users listing.
 */

 var mongoose = require('mongoose')
 	, Targets = mongoose.model('Targets')
	, uuid = require('node-uuid')
 	, util = require('util');

 var addProgress = function(req, res, next){
	Targets.find({uuid: req.params.task_uuid}, function(err, targets){
		if(err){
			return next(err);
		}
		if(targets && targets[0]){
			targets[0].newProgress({
				uuid: uuid.v4(),
				value: req.body.progress_value,
				date: req.body.progress_date,
				description: req.body.progress_description || ""
			}, function(err2, target){
				if(err2){
					next(err2);
				}
				res.send(target);
			});
		}
	});
 };

 var deleteProgress = function(req, res, next){
	Targets.find({uuid: req.params.task_uuid}, function(err, targets){
		if(err){
			return next(err);
		}
		if(targets && targets[0]){
			targets[0].removeProgress(
				req.params.progress_uuid
				, function(err2, target){
					if(err2){
						next(err2);
					}
					res.send(target);
				});
		}
	});
 };

 var test = function(req, res, next){
	var id = uuid.v4();
 	console.log( util.inspect(id, false, 4) );
	res.send({uuid:id});
 }

 var addTarget = function(req, res, next){
 	new Targets({
		uuid: uuid.v4(),
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
 		if(err){
 			return next(err);
 		}
		if(req.params.user){
			res.redirect('/' + req.params.user);
		}else{
			res.redirect('/');
		}
 	});
 };

 var showTarget = function(req, res, next){
 	var query = Targets.find();
 	if(req.params.user){
 		query.find({user: req.params.user});
 	}
	query.find({uuid: req.params.task_uuid});
	query.exec(function(err, targets){
		if(err){
			return next(err);
		}
		var target = targets && targets.length > 0 ? targets[0] : {};
		res.render('detail', {
 			userName: req.params.user,
 			user: req.params.user,
 			target: target,
 			title: 'Detail'
		});
	});
 };
 
 var listTargets = function(req, res, next){
 	var query = Targets.find();
 	if(req.params.user){
 		query.find({user: req.params.user});
 	}
 	query.exec(function(err, targets){
 		if(err){
 			return next(err);
 		}
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
exports.show = showTarget;
exports.add_progress = addProgress;
exports.delete_progress = deleteProgress;

exports.test = test;
