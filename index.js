function keyup() {
	var mark = document.getElementById('getm').value;
	var regex = /\s+/gi;
	if (mark) {
		document.getElementById('content').innerHTML = marked(mark);
		var wordCount = document.getElementById('content').innerText.trim().replace(regex, ' ').split(' ').length;
		document.getElementById('wordcount').innerHTML = wordCount + " words";
	} else {
		document.getElementById('content').innerHTML = "";
		document.getElementById('wordcount').innerHTML = "";
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
