
function addToList(name){
	//helper function - automate adding option to <select id="list">
	var option = document.createElement("option");
	option.textContent = name;
	option.id = name;
	list.appendChild(option);
}

function initialize() {
	//initializes project options - both at start up and update after delete
	//first clear project options from html select
	clearHtml(list, 0);
	
	//then update list of projects from localStorage
	var projects = JSON.parse(localStorage.getItem("projects")) || 
				{"Example Project": {
					notes: "add notes here",
					timetable: []
				}};

	//then add updated project options to html select
	for (var name in projects)
		if (projects.hasOwnProperty(name))
			addToList(name);

	notes.value = projects[list.value].notes;
	displayTimetable(projects);

	return projects;	
};

function displayTimetable(projects) {
	clearHtml(tableBody, 1);
	var htmlRow;
	projects[list.value].timetable.forEach(function(row, i){
		htmlRow = makeRow([row.col0, row.col1, row.col2], i);
		tableBody.insertBefore(htmlRow, tableBody.children[0]);
	});
}

function saveToStorage() {
	//saves projects object in JSON format
	//projects object properties are "title: notes" for each project
	localStorage.setItem("projects", JSON.stringify(projects));
}

function addProject() {
	//bind to <button>new</button>
	//gets user input for project title
	var name = prompt("Project name", "");
	//adds project to projects object, select box and localStorage
	if (!name) return;
	if(!projects.hasOwnProperty(name)) {
		projects[name] = {notes: "", timetable: []};
		addToList(name);
		saveToStorage();
	}
	//sets select option and textarea to new project
	notes.value = projects[name].notes;
	list.value = name;
	clearHtml(tableBody, 1);
}

function removeProject() {
	//removes current project from projects object
	delete projects[list.value];
	//saves updated projects object
	saveToStorage();
	//reinitializes projects object as well as html display
	projects = initialize();
	//note: initialize function updates the projects object.
	//This is repetitive and there's probably a better way.
}

var list = document.querySelector("#list");
var notes = document.querySelector("#notesarea");
var tableBody = document.querySelector("#timetable tbody");
var emptyRow = document.querySelector("#start");
var projects = initialize();

list.addEventListener("change", function() {
	notes.value = projects[list.value].notes;
	displayTimetable(projects);
});

notes.addEventListener("change", function() {
	projects[list.value].notes = notes.value;
	saveToStorage();
});

emptyRow.addEventListener("click", function() {

	var newRowName = projects[list.value].timetable.length;
	var newRow = makeRow([TimeHandler(), "Click here to end task", ""], 
		newRowName);
	createRowData(newRow);
	
	var explainComments = "Add comments here."
	newRow.children[2].appendChild(makeTextarea(explainComments));
	newRow.children[1].classList.add("on");
	
	newRow.addEventListener("click", function() {
		//I will consider moving the addEventListener assignment to newRow
		//to be handled and assigned to individual columns in makeRow function.
		//This will work because even when reloading the timetable I will still
		//want event listeners on unsaved entries. 
		//I suspect there will be lots of issues with argument passing.
		var item = event.target;
		var classes = item.classList;
		if(item.parentNode.className == "col2"){
			if(item.value == explainComments) item.value = "";
			var row = this.className;
			updateData(row, "col2", item.value);
		}else if(classes.contains("col1") && classes.contains("on")) {
			var endTime = TimeHandler();
			updateData(this.className, "col1", endTime);
			item.textContent = endTime;
			item.classList.remove("on");
			setComments(item, explainComments);
			updateData(this.className, "col2", item.nextSibling.textContent);
		}
		saveToStorage();
	});

	tableBody.insertBefore(newRow, emptyRow);
	saveToStorage();
});

function createRowData(newRow) {
	//newRow.className = projects[list.value].timetable.length;
	for(var i=0; i<newRow.children.length-1; i++) {
		updateData(newRow.className, newRow.children[i].className, 
			newRow.children[i].textContent);
	}
}

function makeTextarea(comments){
	var newTextarea = document.createElement("textarea");
	newTextarea.value = comments;
	return newTextarea;
}

function setComments(item, explainComments) {
	var savedComments = item.nextSibling.childNodes[0].value;
	if(savedComments == explainComments) savedComments = "";
	item.nextSibling.removeChild(item.nextSibling.childNodes[0]);
	item.nextSibling.textContent = savedComments;
}

function updateData(row, col, content) {
	var currentTable = projects[list.value].timetable;
	if(!currentTable[row]) currentTable[currentTable.length]={};
	currentTable[row][col] = content;
}

function TimeHandler() {
	var now = new Date();
	return now.toLocaleTimeString()+" - "+now.toDateString();
}

function makeRow(tableData, rowName) {
	//maybe change to accept textContent or html element for tableData
	var newRow = document.createElement("tr");
	newRow.className = rowName;
	var newCol;
	for(var i =0; i<tableData.length; i++) {
		newCol = document.createElement("td");
		newCol.textContent = tableData[i];
		newCol.className = "col"+i;
		newRow.appendChild(newCol);
	};
	var editButtonCol = document.createElement("td");
	var editButton = document.createElement("button");
	editButton.onclick = removeRow;
	editButton.textContent = "x";
	editButtonCol.appendChild(editButton);
	editButtonCol.className = "col3";
	newRow.appendChild(editButtonCol);
	return newRow;
}

function removeRow(e) {
	var row = e.target.parentNode.parentNode;
	projects[list.value].timetable.splice(row.className,1);
	row.style.display = "none";
	saveToStorage();
}

function clearHtml(node, end){
	while(node.childElementCount > end) {
		node.removeChild(node.firstElementChild);
	}
}
