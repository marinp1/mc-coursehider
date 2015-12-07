// Initialize array of hidden elements.
var res = [];

// Check online or local storage for previous state.
chrome.storage.sync.get('blacklistmc', function (result) {
	if (result.blacklistmc !== undefined) {
		res = JSON.parse(result.blacklistmc);
	}
	updateView();
});

// Create hide icons to course boxes.
if (document.title.startsWith("MyCourses:")) {
	var elements = document.getElementsByClassName("coursebox");
	for (i=0;i<elements.length;i++) {
		var insBef = elements[i].childNodes[elements[i].childNodes.length - 1];
		var div = document.createElement("div");
		var h6 = document.createElement("i");
		h6.setAttribute("style", "font-size: 1.2rem");
		h6.setAttribute("class", "fa fa-eye-slash");
		div.setAttribute("title", "Click to hide course from list.")
		div.setAttribute("class", "mc-ext-remover");
		div.appendChild(h6)
		elements[i].insertBefore(div, insBef);
	}
}

$(".mc-ext-remover").click(function(e) {
	var parent = e.currentTarget.parentNode;
	var title = parent.getElementsByClassName("course_title")[0].textContent;
	var pid = parent.getAttribute("id");
	var menu = findCoursesNav();
	var course = newCourse(title,pid);
	if (!contains(res,course)) {
		res.push(course);
		updateView();
	}
})

// Hide required elements.
function updateView() {
	var menu = findCoursesNav();
	for (var j=0;j<menu.length;j++) {
		$(menu[j]).removeClass("pleshide");
	}

	for (var i=0;i<res.length;i++) {
		var title = res[i].name;
		var pid = res[i].id;

		for (var j=0;j<menu.length;j++) {
			if (menu[j].textContent == title) {
				$(menu[j]).addClass("pleshide");
			}
		}

		$(document.getElementById(pid)).addClass("pleshide");
	}

    chrome.storage.sync.set({'blacklistmc': JSON.stringify(res)}); //Save state.
}

// Return course list from navigation bar.
function findCoursesNav() {
	var elements = document.getElementsByClassName("dropdown");
	for (var i=0;i<elements.length;i++) {
		if (elements[i].getElementsByTagName("a")[0].getAttribute("href") == "https://mycourses.aalto.fi/course/index.php") {
			return elements[i].getElementsByTagName("ul")[0].getElementsByTagName("li");
		}
	}
}

chrome.runtime.sendMessage({
  from:    'injector',
  subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'courses') && (msg.subject === 'DOMInfo')) {
    response(res);
  } else if ((msg.from === 'courses') && (msg.subject === 'update')) {
  	var dataID = msg.data.id;
  	for (var k = 0;k<res.length;k++) {
  		if (res[k].id == dataID) {
  			$(document.getElementById(dataID)).removeClass("pleshide");
  			res.splice(k,1);
  		}
  	}
  	updateView();
  	response(res);
  }
});

function newCourse(name,id) {
	var that = {};
	that.name = name;
	that.id = id;
	return that;
}


function contains(arr,elem) {
	for (var i = 0;i<arr.length;i++) {
		if (arr[i] == elem) {
			return true;
		}
	}
	return false;
}