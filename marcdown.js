const keyUp = () => {
	let mark = document.getElementById('getm').value
	let viewer = document.getElementById('viewer')
	let regex = /\s+/gi
	if (mark !== '') {
		viewer.innerHTML = marked(mark)
	} else {
		viewer.innerHTML = ''
	}
}
const apply = (e) => {
	let myField = document.getElementById('getm')
	let myValueBefore
	let myValueAfter
	switch (e) {
		case 'bold':
			myValueBefore = '**'
			myValueAfter = '**'
			break
		case 'italic':
			myValueBefore = '*'
			myValueAfter = '*'
			break
		case 'strike':
			myValueBefore = '~'
			myValueAfter = '~'
			break
		case 'h1':
			myValueBefore = '# '
			myValueAfter = ''
			break
		case 'h2':
			myValueBefore = '## '
			myValueAfter = ''
			break
		case 'h3':
			myValueBefore = '### '
			myValueAfter = ''
			break
		case 'bq':
			myValueBefore = '> '
			myValueAfter = ''
			break
		case 'ol':
			myValueBefore = '1. '
			myValueAfter = ''
			break
		case 'ul':
			myValueBefore = '- '
			myValueAfter = ''
			break
		case 'code':
			myValueBefore = '```'
			myValueAfter = '```'
			break
		case 'link':
			myValueBefore = '['
			myValueAfter = ']()'
			break
		case 'check':
			myValueBefore = '- [x] '
			myValueAfter = ''
			break
		case 'image':
			myValueBefore = '![alt text](image.jpg)'
			myValueAfter = ''
			break
		case 'hr':
			myValueBefore = '---\n'
			myValueAfter = ''
			break
		case 'table':
			myValueBefore = '| Header | Title |\n| ----------- | ----------- |\n| Paragraph | Text |\n'
			myValueAfter = ''
			break
	}
	if (document.selection) {
		myField.focus()
		document.selection.createRange().text = myValueBefore + document.selection.createRange().text + myValueAfter
	} else if (myField.selectionStart || myField.selectionStart == '0') {
		let startPos = myField.selectionStart
		let endPos = myField.selectionEnd
		myField.value = myField.value.substring(0, startPos) + myValueBefore + myField.value.substring(startPos, endPos) + myValueAfter + myField.value.substring(endPos, myField.value.length)
		myField.selectionStart = startPos + myValueBefore.length
		myField.selectionEnd = endPos + myValueBefore.length
		myField.focus()
	}
	keyUp()
}
