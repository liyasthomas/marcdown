function keyup() {
	var mark = document.getElementById('getm').value;
	if (mark)
		document.getElementById('content').innerHTML = marked(mark);
	else
		document.getElementById('content').innerHTML = "marcdown will appere here";
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
