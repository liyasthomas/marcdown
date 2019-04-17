function keyup() {
	var mark = document.getElementById('getm').value;
	var regex = /\s+/gi;
	if (mark != '') {
		document.getElementById('content').innerHTML = marked(mark);
		var wordCount = document.getElementById('content').innerText.trim().replace(regex, ' ').split(' ').length;
		document.getElementById('wordcount').innerHTML = wordCount + " words";
		document.getElementById('save').disabled = false;
	} else {
		document.getElementById('content').innerHTML = "";
		document.getElementById('wordcount').innerHTML = "";
		document.getElementById('save').disabled = true;
	}
}
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute('data-theme', 'dark');
	} else {
		document.documentElement.setAttribute('data-theme', 'light');
	}
}
toggleSwitch.addEventListener('change', switchTheme, false);

function download() {
	var text = document.getElementById("getm").value;
	text = text.replace(/\n/g, "\r\n");
	var blob = new Blob([text], {
		type: "text/plain"
	});
	var anchor = document.createElement("a");
	anchor.download = "marcdown.md";
	anchor.href = window.URL.createObjectURL(blob);
	anchor.target = "_blank";
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
}
var openFile = function (e) {
	var input = e.target;
	var reader = new FileReader();
	reader.onload = function () {
		document.getElementById('getm').value = reader.result;
	};
	reader.readAsText(input.files[0]);
};
