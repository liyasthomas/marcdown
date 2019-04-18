function mouseup() {
	var mark = document.getElementById('getm'),
		lineno = document.getElementById('lineno'),
		colno = document.getElementById('colno'),
		textLines = mark.value.substr(0, mark.selectionStart).split("\n");
	lineno.innerHTML = "Line " + textLines.length;
	colno.innerHTML = "Col " + textLines[textLines.length - 1].length;
}

function keyup() {
	var mark = document.getElementById('getm').value,
		content = document.getElementById('content'),
		wordcount = document.getElementById('wordcount'),
		charcount = document.getElementById('charcount'),
		save = document.getElementById('save'),
		regex = /\s+/gi;
	if (mark !== '') {
		content.innerHTML = marked(mark);
		var wordCount = content.innerText.trim().replace(regex, ' ').split(' ').length,
			charCount = content.innerText.replace(regex, '').length;
		wordcount.innerHTML = wordCount + " words";
		charcount.innerHTML = charCount + " chars";
		save.disabled = false;
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightBlock(block);
		});
		mouseup();
	} else {
		content.innerHTML = "";
		wordcount.innerHTML = "0 words";
		charcount.innerHTML = "0 chars";
		save.disabled = true;
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
		keyup();
		input.value = '';
	};
	reader.readAsText(input.files[0]);
};
document.onkeyup = function (e) {
	if (e.altKey && e.which == 79) {
		document.getElementById("file").click();
	} else if (e.altKey && e.which == 83) {
		document.getElementById("save").click();
	}
};
