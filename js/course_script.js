// Create html content.
function setDOMInfo(res) {
  var nCourses = document.getElementById("num_of_courses");
  nCourses.innerText = res.length;
	var lista = document.getElementById("course_list");
	lista.innerHTML = "";
	for (i=0;i<res.length;i++) {

		var coursediv = document.createElement("div");
		var textdiv = document.createElement("div");
		var removediv = document.createElement("div");
		var t = document.createTextNode(res[i].name);
		textdiv.appendChild(t);

    var table= document.createElement("div");
    table.setAttribute("class", "display-table");
    var cell = document.createElement("div");
    cell.setAttribute("class", "display-cell");
    var cross = document.createTextNode("X");
    cell.appendChild(cross);
    table.appendChild(cell);
    removediv.appendChild(table);

		textdiv.setAttribute("class", "text");
		removediv.setAttribute("class", "remove");
		coursediv.setAttribute("class", "course");
		coursediv.setAttribute("id", res[i].id);

		coursediv.appendChild(textdiv)
		coursediv.appendChild(removediv)
		lista.appendChild(coursediv);  
	}
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'courses', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script)
        setDOMInfo);
  });
});

// Inform which course was made visible and update html content.
$(document).on('click','.remove',function(e){
  console.log(e.target.parentElement.parentElement.parentElement);
	var courseID = e.target.parentElement.parentElement.parentElement.id;
	var courseName = e.target.parentElement.parentElement.parentElement.children[0].textContent;
	var datatosend = {name: courseName, id: courseID};
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'courses', subject: 'update', data: datatosend},
        setDOMInfo);
  });
});