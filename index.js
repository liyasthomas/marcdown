const mouseUp = () => {
	let mark = document.getElementById('getm');
	let lineno = document.getElementById('lineno');
	let colno = document.getElementById('colno');
	let textLines = mark.value.substr(0, mark.selectionStart).split("\n");
	lineno.innerHTML = `Line ${textLines.length}`;
	colno.innerHTML = `Col ${textLines[textLines.length - 1].length}`;
}
const keyUp = () => {
	let mark = document.getElementById('getm').value;
	let viewer = document.getElementById('viewer');
	let wordcount = document.getElementById('wordcount');
	let charcount = document.getElementById('charcount');
	let save = document.getElementById('save');
	let regex = /\s+/gi;
	if (mark !== '') {
		viewer.innerHTML = marked(mark);
		let wordCount = viewer.innerText.trim().replace(regex, ' ').split(' ').length;
		let charCount = viewer.innerText.replace(regex, '').length;
		wordcount.innerHTML = `${wordCount} words`;
		charcount.innerHTML = `${charCount} chars`;
		save.disabled = false;
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightBlock(block);
		});
		mouseUp();
	} else {
		viewer.innerHTML = "";
		wordcount.innerHTML = "0 words";
		charcount.innerHTML = "0 chars";
		save.disabled = true;
	}
}
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const switchTheme = ({
	target
}) => {
	if (target.checked) {
		document.documentElement.setAttribute('data-theme', 'dark');
	} else {
		document.documentElement.setAttribute('data-theme', 'light');
	}
}
toggleSwitch.addEventListener('change', switchTheme, false);
const download = () => {
	let text = document.getElementById("getm").value;
	text = text.replace(/\n/g, "\r\n");
	let blob = new Blob([text], {
		type: "text/plain"
	});
	let anchor = document.createElement("a");
	anchor.download = "marcdown.md";
	anchor.href = window.URL.createObjectURL(blob);
	anchor.target = "_blank";
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
}
let openFile = ({
	target
}) => {
	let input = target;
	let reader = new FileReader();
	reader.onload = () => {
		document.getElementById('getm').value = reader.result;
		keyUp();
		input.value = '';
	};
	reader.readAsText(input.files[0]);
};
document.onkeyup = ({
	altKey,
	which
}) => {
	if (altKey && which == 79) {
		document.getElementById("file").click();
	} else if (altKey && which == 83) {
		document.getElementById("save").click();
	}
};
const apply = (e) => {
	let myField = document.getElementById("getm");
	let myValueBefore;
	let myValueAfter;
	switch (e) {
		case 'bold':
			myValueBefore = "**";
			myValueAfter = "**";
			break;
		case 'italic':
			myValueBefore = "*";
			myValueAfter = "*";
			break;
		case 'strike':
			myValueBefore = "~";
			myValueAfter = "~";
			break;
		case 'h1':
			myValueBefore = "# ";
			myValueAfter = "";
			break;
		case 'h2':
			myValueBefore = "## ";
			myValueAfter = "";
			break;
		case 'h3':
			myValueBefore = "### ";
			myValueAfter = "";
			break;
		case 'bq':
			myValueBefore = "> ";
			myValueAfter = "";
			break;
		case 'ol':
			myValueBefore = "1. ";
			myValueAfter = "";
			break;
		case 'ul':
			myValueBefore = "- ";
			myValueAfter = "";
			break;
		case 'code':
			myValueBefore = "```";
			myValueAfter = "```";
			break;
		case 'link':
			myValueBefore = "[";
			myValueAfter = "]()";
			break;
		case 'check':
			myValueBefore = "- [x] ";
			myValueAfter = "";
			break;
		case 'image':
			myValueBefore = "![alt text](image.jpg)";
			myValueAfter = "";
			break;
		case 'hr':
			myValueBefore = "---\n";
			myValueAfter = "";
			break;
		case 'table':
			myValueBefore = "| Header | Title |\n| ----------- | ----------- |\n| Paragraph | Text |\n";
			myValueAfter = "";
			break;
	}
	if (document.selection) {
		myField.focus();
		document.selection.createRange().text = myValueBefore + document.selection.createRange().text + myValueAfter;
	} else if (myField.selectionStart || myField.selectionStart == '0') {
		let startPos = myField.selectionStart;
		let endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos) + myValueBefore + myField.value.substring(startPos, endPos) + myValueAfter + myField.value.substring(endPos, myField.value.length);
		myField.selectionStart = startPos + myValueBefore.length;
		myField.selectionEnd = endPos + myValueBefore.length;
		myField.focus();
	}
	keyUp();
}
const preview = (e) => {
	let viewer = document.getElementById('viewer');
	let mark = document.getElementById('getm');
	switch (e) {
		case 'nill':
			viewer.style.width = '100vw';
			viewer.style.padding = "16px";
			mark.style.width = "0";
			mark.style.padding = "0";
			break;
		case 'half':
			viewer.style.width = '50vw';
			viewer.style.padding = "16px";
			mark.style.width = "50vw";
			mark.style.padding = "16px";
			break;
		case 'full':
			viewer.style.width = '0';
			viewer.style.padding = "0";
			mark.style.width = "100vw";
			mark.style.padding = "16px";
			break;
	}
}
