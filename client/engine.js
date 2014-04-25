var length = 0;
var lastKey = 0;
var keys = [];
var values = [];
var page = 1;
var doUpdate = false;

function currentDateString() {
	var date = new Date();
	return "" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-" + (date.getDate() <= 9 ? "0" : "") + 
		date.getDate() + "-" + (date.getYear() < 200 ? date.getYear() + 1900 : date.getYear()) + " " + 
		(date.getHours() <= 9 ? "0" : "") + date.getHours() + ":" + (date.getMinutes() <= 9 ? "0" : "") + 
		date.getMinutes() + ":" + (date.getSeconds() <= 9 ? "0" : "") + date.getSeconds();
}

function addElem(id, name, description, date, isComplete) {
	$("#progress").css('display','block');
	var inner = "<span>" + id + "</span> <span>" + name + "</span> <span>" + description + "</span> " +
    "<span>" + date + "</span> <span>" + isComplete + "</span> " +
    "<span><img src='icons/edit.png' alt='Edit' title='Изменить' class='edit' onclick='updateTask(\"" + id + "\")'>" +
    "<img src='icons/remove.png' alt='Remove' title='Удалить' class='remove' onclick='removeTask(\"" + id + "\")'></span>";
    var posting = $.post('/addnote', { 'id': id, 'name': name, 'description': description, 'date': date, 'iscomplete': isComplete });
    posting.done(function (data) {
    	$('#progress').css('display', 'none');
    });

   	$('<div class="items" id="' + id + '" draggable>' + inner + '</div>').insertBefore(document.getElementById('add'));
}

$(document).ready(function () {
	$('#newtask').on("click", function () {
		$('#add').css("display","block");
		$('#whattodo').text("Добавить");
		$('#id_field').text("el" + (lastKey + 1));
	});

	$('#removeall').on("click", function () {
		$('.items').remove();
		$.post("/remove", { 'id': 'all'});
		length = lastKey = 0;
	});

	$('#confirm').on("click", function () {
		id = $("#id_field").text();
		name = $("#name_field").val();
		description = $("#description_field").val();
		date = $('#date_field').text();
		isComplete = $("#complete_field").prop("checked");
		if (!doUpdate) {
			date = currentDateString();
			addElem(id, name, description, date, isComplete);
			hide();
			length++;
			lastKey++;
		} else {
			var inner = "<span>" + id + "</span> <span>" + name + "</span> <span>" + description + "</span> " +
		    "<span>" + date + "</span> <span>" + isComplete + "</span> " +
			"<span><img src='icons/edit.png' alt='Edit' title='Изменить' class='edit' onclick='updateTask(\"" + id + 
			"\")'>" + "<img src='icons/remove.png' alt='Remove' title='Удалить' class='remove' onclick='removeTask(\"" + 
			id + "\")'></span>";
			var posting = $.post('/update', { 'id': id, 'name': name, 'description': description, 'date': date, 
				'iscomplete': isComplete });
		    posting.done(function (data) {
		    	$('#progress').css('display', 'none');
		    });
		    $('#' + id).html(inner);
		   	/*$('<div class="items" id="' + id + '" draggable>' + inner + 
		   		'</div>').insertBefore(document.getElementById('add'));*/
			doUpdate = false;
			hide();
		}
	});

	$('#hide').on("click", function () { 
		hide();
	});

	var posting = $.post('/all', { 'fun': "getAllTasks" }, function(data) {
		for (var i = 0; i < data.result.length; i++) {
			if (data.result[i] == undefined)
				continue;

			var inner = "<span>" + data.result[i].ID + "</span> <span>" + data.result[i].Name + "</span> <span>" + 
				data.result[i].Description + "</span> " + "<span>" + data.result[i].Date + "</span> <span>" + 
				(data.result[i].Completed == 1 ? "true" : "false") + "</span> " +
				"<span><img src='icons/edit.png' alt='Edit' title='Изменить' class='edit' onclick='updateTask(\"" + 
				data.result[i].ID + "\")'>" + 
				"<img src='icons/remove.png' alt='Remove' title='Удалить' class='remove' onclick='removeTask(\"" + 
				data.result[i].ID + "\")'></span>";
			$('<div class="items" id="' + data.result[i].ID + '" draggable>' + inner + 
				'</div>').insertBefore(document.getElementById('add'));
			length++;
			var cur = parseInt(data.result[i].ID.substring(2));
			lastKey = (lastKey < cur ? cur : lastKey);
		};
	}, "json");
});

/*function confirm() {
	id = document.getElementById("id_field").value;
	name = document.getElementById("name_field").value;
	description = document.getElementById("description_field").value;
	isComplete = document.getElementById("complete_field").checked;
	if (/*!localStorage[id]*/ /*true) {
		date = currentDateString();
		//jsonString = '{"id":"'+ id +'", "name":"' + name +'","description":"' + description + '","date":"'+date+'","iscomplete":"'+isComplete+'"}';
		//localStorage.setItem(id, jsonString);
		addElem(id, name, description, date, isComplete);
		hide();
		length++;
		lastKey++;
	} else {
		if (document.getElementById("date_field").value) {
			//jsonString = '{"id":"'+ id +'","name":"' + name +'","description":"' + description + '","date":"'+document.getElementById("date_field").value +'","iscomplete":"'+isComplete+'"}';
			//localStorage.setItem(id, jsonString);
			el = document.getElementById(id);
			el.innerHTML = "<span>" + id + "</span> <span>" + name + "</span> <span>" + description + "</span> <span>" + document.getElementById("date_field").value + "</span> <span>" + isComplete + "</span> <span><input type='button' value='Edit' onclick='updateTask(\"" + id + "\")'><input type='button' value='Remove' onclick='removeTask(\"" + id + "\")'></span>";
			hide();
		} else
			alert("Нельзя создать новый объект с существующим идентификатором!");
	}
}*/

function hide() {
	$("#id_field").text("");
	$("#name_field").val("");
	$("#description_field").val("");
	$("#complete_field").prop("checked", false);
	$('#date_field').text('will be generated');
	$('#add').css("display","none");
}

function removeTask(id) {
	$("#" + id).remove();
	$.post("/remove", { 'id': id});
	length--;
}

function updateTask(id) {
	$('#add').css("display","block");
	$("#whattodo").text("Изменить");
	$("#id_field").text(id);
	doUpdate = true;
	// $('#' + id + " span:nth-child(1)").text();
	//elem = JSON.parse(localStorage.getItem(id));
	$("#name_field").val($('#' + id + " span:nth-child(2)").text());
	//$("#name_field").val(elem.name);
	$("#description_field").val($('#' + id + " span:nth-child(3)").text());
	//$("#description_field").val(elem.description);
	$("#date_field").text($('#' + id + " span:nth-child(4)").text());
	//$("#date_field").text(elem.date);
	$("#complete_field").prop("checked", ($('#' + id + " span:nth-child(5)").text() == "true" ? true : false));
	//$("#complete_field").prop("checked", (elem.iscomplete == "true" ? true : false));
}