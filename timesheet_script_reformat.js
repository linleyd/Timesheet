	var projects = [0]
	
	function choose(obj) {
		var current_project = document.querySelector(".chosen");
		if(current_project != null) {
			current_project.classList.remove("chosen");
		}
		if(current_project != obj){
			obj.classList.add("chosen");
		}
	}

	function removeProject() {
		var projs = document.getElementById("proj_items");
		var current_project = document.querySelector(".chosen");
		projs.removeChild(current_project);
	}

	function addProject() {
		//add class to indicate project
		//or just use children of proj_items

		var name = document.getElementById("proj_name").value;
		var div_example = document.getElementById("proj0");
		var newdiv = div_example.cloneNode(true);
		document.getElementById("proj_items").appendChild(newdiv);
		newdiv.id=name
		var title = newdiv.querySelector(".title");
		title.textContent = name;
		title.addEventListener("click", function(){choose(this.parentNode)});
		projects[projects.length] = new project(newdiv);

	}

	var timerId = null;
	var last = 0;
	var current = 0;
	var init = 0;
	var elapsed = 0;

	function start() {
		if(timerId) { return };
		init = new Date();
		init = init.getTime();
		timerId = setInterval(function(){myTimer()}, 1000);
		myTimer();
	}

	function stop() {
		clearInterval(timerId);
		timerId=null;
		last =  0;
		saveEntry();

		var chosen_project =  document.querySelector(".chosen");
		var hour_display = chosen_project.querySelector('.hour');
		var min_display = chosen_project.querySelector('.min');
		var sec_display = chosen_project.querySelector('.sec');
  		
  		hour_display.innerHTML = 'hh';
		min_display.innerHTML = 'mm';
		sec_display.innerHTML = 'ss';
		}

	function myTimer() {
		var chosen_project =  document.querySelector(".chosen");
		var hour_display = chosen_project.querySelector('.hour');
		var min_display = chosen_project.querySelector('.min');
		var sec_display = chosen_project.querySelector('.sec');


		current = new Date();
		current = current.getTime();
		elapsed = current-init+last;

		var hours = Math.round((elapsed)/(60*60*1000));
		if(hours <10 ) hours = '0' + hours;
		hour_display.innerHTML = hours;

		var minutes = (elapsed)%(60*60*1000);
		minutes = Math.round(minutes/(60*1000));
		if (minutes < 10) minutes = '0'+minutes;
		min_display.innerHTML = minutes;

		var seconds = (elapsed)%(60*1000);
		seconds = Math.round(seconds/1000);
		if (seconds < 10) seconds = '0'+seconds;
		sec_display.innerHTML = seconds;
	}


	function saveEntry() {

		var chosen_project =  document.querySelector(".chosen");
		var hour_display = chosen_project.querySelector('.hour');
		var min_display = chosen_project.querySelector('.min');
		var sec_display = chosen_project.querySelector('.sec');

		
		var hours = hour_display.textContent;
		var mins =  min_display.textContent;
		var secs = sec_display.textContent;
		var time_elapsed = hours + ":"+ mins + ":" + secs;
		var notes = chosen_project.querySelector(".note_input").value;
		var date = new Date();
		date = date.toDateString();
		var new_entry = new entry(date, time_elapsed, notes);

		var projs = document.getElementById("proj_items");

		var current_project = null;
		for(i=0;i<projects.length;i++) {
			if(projects[i].element === chosen_project) {
				var current_project = projects[i];
			}
		}
		//chosen_project is html element, current_project is object of project class
		current_project.entries[current_project.entries.length]=new_entry;		

		var history = chosen_project.querySelector(".proj_history");
		var newtr = document.createElement("tr");
		
		var newtd = document.createElement("td");
		var node = document.createTextNode(new_entry.date);
		newtd.appendChild(node);
		newtr.appendChild(newtd);
		
		var newtd = document.createElement("td");
		var node = document.createTextNode(new_entry.duration);
		newtd.appendChild(node);
		newtr.appendChild(newtd);
		
		var newtd = document.createElement("td");
		var node = document.createTextNode(new_entry.notes);
		newtd.appendChild(node);
		newtr.appendChild(newtd);
				
		newtr.appendChild(newtd);
		history.appendChild(newtr);

	}


	function project(element) {
		this.element = element;
		this.general_info = [];
		this.entries = [0];

	}

	function entry(date, duration, notes) {
		this.date = date;
		this.duration = duration;
		this.notes = notes;
	}