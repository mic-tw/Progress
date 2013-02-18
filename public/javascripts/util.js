
var notEmpty = function(obj){
	var value = obj.val();
	return null != value && "" != value;
};

var isDigitValue = function(obj){
	var value = obj.val();
	var dig = parseInt(value);
	if(isNaN(dig)){
		return false;
	}
	return value == dig && value.toString() == dig.toString();
};

var sumProgress = function(task){
	var progress = 0;
	for(var i = 0 ; task.progress && i < task.progress.length ; i++){
		progress += task.progress[i].value;
	}
	return progress;
};

var errField = function(obj){
	obj.parent().addClass('err');
};

var validField = function(obj){
	obj.parent().removeClass('err');
};

var validateProgressForm = function(){
	$('input[name="progress_date"]').blur(function(){
		var obj = $(this);
		if(notEmpty(obj)){
			validField(obj);
		}else{
			errField(obj);
		}
	});
	$('input[name="progress_value"]').blur(function(){
		var obj = $(this);
		if(isDigitValue(obj)){
			validField(obj);
		}else{
			errField(obj);
		}
	});
};

var updateProgress = function(progress_bar, task){
	var progress = sumProgress(task);
	progress_bar.attr('progress', progress );
	var ratio = 100 * progress / progress_bar.attr('progress_max');
	ratio = Math.max(0, Math.min(100, ratio ));
	progress_bar.children('.bar').css('width', ratio + '%');
	progress_bar.children('.text').text(ratio + '%');
};

var submitNewProgressCallback = function(user, target, eleTarget){
	var popup = target.parent();
	var date = popup.find('[name="progress_date"]');
	var value = popup.find('[name="progress_value"]');
	var uuid = popup.attr('target_uuid');
	if( isDigitValue( value ) ){
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: '/' + user + '/target/' + uuid + '/progress/add',
			data: {
				progress_value: value.val(),
				progress_date: date.val()
			},
			success: function(data, status, xhr){
				var progress_bar = eleTarget.find('[progress]');
				updateProgress(progress_bar, data);
				value.val('');
				date.val('');
				eleTarget.attr('status', 'collapsed');
			}
		});
	}
	return false;
};

var deleteProgressCallback = function(user, target){
	var progress = target.parents('.task-progress[uuid]');
	var uuid = progress.attr('uuid');
	var task = progress.attr('task');
	$.ajax({
		type: "POST",
		dataType: 'json',
		url: '/' + user + '/target/' + task + '/progress/' + uuid + '/delete',
		success: function(data, status, xhr){
			var progress_bar = $('.milestone').find('[progress]');
			updateProgress(progress_bar, data);
			progress.remove();
		}
	});
};
