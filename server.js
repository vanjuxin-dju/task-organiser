var express = require('express');
var app = express();
var path = require('path');
var http = require('http');

app.set('client', path.join(__dirname, 'client'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));

/*
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();
*/
app.get('/', function(req, res){
    /*var body = 'rewrewr';
	res.setHeader("Content-Type","text-plain");
	res.setHeader("Content-Length", Buffer.byteLength(body));
	res.end(body);*/
	//app.get('client')
	res.redirect('/index.html');
});
app.post("/addnote", function(req, res){
	var id = req.body.id;
	var name = req.body.name;
	var description = req.body.description;
	var date = req.body.date;
	var iscomplete = req.body.iscomplete;
	
	res.json({ ok: true });
	console.log("task " + id + " had added");
})
app.listen(3000);