
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose');

  /*var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/mydb';

  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection('mydocs', function(er, collection) {
      collection.insert({'mykey':'myvalue'}, {safe: true} , function(er, rs) {

      });
    });
  });*/

  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var Task = new Schema({
    task :String
  });
  var Task = mongoose.model('Task', Task);

  mongoose.connect('mongodb://localhost/Task', function(err) {
  if(!err) {
    console.log('connected to mongo DB');
  } else {
    throw err;
  }
});


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/contact', function(req, res){
  var user = {
    first_name : "billy",
    last_name : "goat",

  };
  res.render('contact.jade',{title: 'User', user: user});
});
app.get('/about', function(req, res) {
	res.send("Hello from the about route");
});
app.post('/', function(req, res) {
	res.send(req.body);
});	
app.get('/user/:id', function(req, res) {
  res.send('show content for user id ' + req.params.id);
});

app.get('/tasks/new', function(req, res) {
  res.render('tasks/new.jade', {
    title: 'New Tasks'
  });
});

app.post('/tasks', function(req, res) {
 var task = new Task(req.body.task);
 task.save(function(err) {
  if(!err) {
    res.redirect('/tasks');
  } else {
    res.redirect('/tasks/new');
  }
 });
});

app.get('/tasks/:id/edit', function(req, res) {
  Task.findById(req.params.id, function(err, doc) {
      res.render('tasks/edit', {
        title: 'Edit Task View',
        task: doc
      });
  });
});

app.put('/tasks/:id', function(req, res) {
  Task.findById(req.params.id, function(err, doc) {
    doc.task = req.body.task.task;
    doc.save(function(err) {
      if(!err) {
        res.redirect('/tasks');
      } else {
        //error handeling
      }
    });
  });
});

app.del('/tasks/:id', function(req, res) {
  Task.findById(req.params.id, function(err, doc) {
    if(!doc) return next(new NotFound('Document not found'));
    doc.remove(function() {
      res.redirect('/tasks');
    });
  });
});

app.get('/tasks', function(req, res) {
  Task.find({}, function(err, docs) {
    res.render('tasks/index', {
    title: 'Todos Index View',
    docs : docs
    });
  });
});

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
