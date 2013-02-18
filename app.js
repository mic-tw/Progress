
/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./db')
  , routes = require('./routes')
  , target = require('./routes/target')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.get('/test', target.test)
app.post('/:user/target/add', target.add);
app.post('/:user/target/:task_uuid/progress/add', target.add_progress);
app.post('/:user/target/:task_uuid/progress/:progress_uuid/delete', target.delete_progress);
app.get('/:user/target/:task_uuid', target.show);
app.get('/:user', target.list);
app.get('/', target.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
