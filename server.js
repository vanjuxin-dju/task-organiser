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

var mysql = require('mysql');

var result = [];

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'task_organiser'
});

connection.connect();
connection.query("select * from tasks", function (err, results) {
	if (err) throw err;
	for (var i = 0; i < results.length; i++) {
		result.push(results[i]);
	};
});

app.get('/', function(req, res){
	res.redirect('/index.html');
});

app.post("/addnote", function(req, res){
	var id = req.body.id;
	var name = req.body.name;
	var description = req.body.description;
	var date = req.body.date;
	var iscomplete = req.body.iscomplete;

	connection.query("insert into tasks (ID, Name, Description, Date, Completed) values ('" + id + 
		"', "+connection.escape(name)+", "+connection.escape(description)+", '"+date+"', "+iscomplete+")");
	
	result.push({
		'Completed': (iscomplete == "true" ? 1 : 0),
		'Date': date,
		'Description': description,
		'ID': id,
		'Name': name
	});

	res.json({ ok: true });
	console.log("task " + id + " had added");
});

app.post("/all", function (req, res) {
	res.json({ 'result': result });
});

app.post("/remove", function(req, res) {
	var id = req.body.id;

	if (id == 'all') {
		result = [];
		connection.query("delete from tasks");
		console.log("all tasks removed");
	} else {
		connection.query("delete from tasks where ID = '" + id + "'");
		for (var i = 0; i < result.length; i++) {
			if (result[i] != undefined && result[i].ID == id) {
				result[i] = undefined;
				console.log("task " + id + " removed");
				break;
			}
		};
	}
});

app.post("/update", function(req,res) {
	var id = req.body.id;
	var name = req.body.name;
	var description = req.body.description;
	var date = req.body.date;
	var iscomplete = req.body.iscomplete;

	connection.query("update tasks set Name = " + connection.escape(name) + ", Description = " + 
		connection.escape(description) + ", Date = '" + date + "', Completed = " + iscomplete + 
		" where ID = '" + id + "'");
	
	for (var i = 0; i < result.length; i++) {
		if (result[i].ID == id) {
			result[i].Name = name;
			result[i].Description = description;
			result[i].Date = date;
			result[i].Completed = (iscomplete ? 1 : 0);
			break;
		}
	};

	res.json({ ok: true });
	console.log("task " + id + " had updated");
});

app.listen(3000);