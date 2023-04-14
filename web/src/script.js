// only used for validation
let noSpotChars = '';
let wrongSpotChars = '';
let rightSpotChars = '';
document.addEventListener('keydown', (event) => {
	console.log(event);
	if (event.code !== 'Backspace' || !event.code.startsWith('Key')) return;

	// remove
	if (event.code == 'Backspace') {
	}
});
function validateNotInNoSpotAndWrongOrRight() {}

function addAutoTab(parent) {
	Array.from(parent.children).forEach((el, i) => {
		el.setAttribute('onkeydown', 'handleBackspaceAutoTab(event, this)');
		el.setAttribute('onkeyup', 'autoTab(event, this)');
		el.setAttribute('maxlength', '1');
		el.setAttribute('data-index', i);

		// auto uppercase input to look nice
		el.addEventListener('input', function (event) {
			this.value = this.value.toUpperCase();
		});

		// limit to only characters
		//https://stackoverflow.com/questions/22708434/restrict-characters-in-input-field
		el.addEventListener('beforeinput', (event) => {
			let regex = /^[a-zA-Z]*$/;
			if (event.data != null && !regex.test(event.data))
				event.preventDefault();
		});
	});
}
document.querySelectorAll('.autotab').forEach((parent) => {
	addAutoTab(parent);
});
//TODO add holding down backspace
function handleBackspaceAutoTab(event, el) {
	if (event.code !== 'Backspace') return;

	event.preventDefault();

	let toFocusEl = el.previousElementSibling;
	// if (!toFocusEl) {
	// 	// if the next row has all the same classes, set toFocusEl to the first child of that row
	// 	// ex end of row going to next when there are multiple worngSpot rows
	// 	let toFocusParent = el.parentElement.previousElementSibling;

	// 	if (
	// 		Array.from(el.parentElement.classList).every((c) => {
	// 			return toFocusParent.classList.contains(c);
	// 		})
	// 	) {
	// 		toFocusEl =
	// 			toFocusParent.children[
	// 				backspace ? toFocusParent.children.length - 1 : 0
	// 			];
	// 	} else return;
	// }

	// if it has content delete it
	if (el.value.length === 1) el.value = '';
	// else delete prev el content
	else toFocusEl.value = '';

	if (toFocusEl.parentElement.classList.contains('autotab'))
		toFocusEl.focus();
}
function autoTab(event, el) {
	let toFocusEl = el.nextElementSibling;
	let upDown = false;

	if (event.code.startsWith('Arrow')) {
		if (event.code === 'ArrowRight') toFocusEl = el.nextElementSibling;
		if (event.code === 'ArrowLeft') toFocusEl = el.previousElementSibling;
		if (event.code === 'ArrowUp' || event.code === 'ArrowDown')
			upDown = true;

		select = true;
	}

	// if not a letter or arrow key
	if (!event.code.startsWith('Key') && !event.code.startsWith('Arrow'))
		return;

	if (upDown) {
		let toFocusParent =
			event.code === 'ArrowUp'
				? el.parentElement.previousElementSibling
				: el.parentElement.nextElementSibling;

		toFocusEl = toFocusParent.children[el.dataset.index];
	}

	if (!toFocusEl) return;

	if (toFocusEl.parentElement.classList.contains('autotab')) {
		toFocusEl.select();
	}
}

// add wrong spot row
function addWrongSpotRow() {
	let currentRows = document.querySelectorAll('.wrongSpotInput');
	if (currentRows.length === 4)
		document.getElementById('addWrongSpotRowButton').remove();

	let parent = document.createElement('div');
	parent.classList.value = 'letterInputRow autotab wrongSpotInput';

	for (let i = 0; i < 5; i++) {
		let el = document.createElement('input');
		parent.appendChild(el);
	}
	addAutoTab(parent);

	currentRows[currentRows.length - 1].after(parent);
}

// req possible answers
function getPossibleAnswers() {
	let notInWordInput = document.querySelector('.notInWordInput');
	let wrongSpotInput = document.querySelectorAll('.wrongSpotInput');
	let rightSpotInput = document.querySelector('.rightSpotInput');

	let notInWord = notInWordInput.value.replace(/\s/g, '');
	let inWrongSpot = [];
	let inRightSpot = '';

	Array.from(wrongSpotInput).forEach((row) => {
		let rowArr = [];
		Array.from(row.children).forEach((el) => {
			if (el.value.replace(/\s/g, '') == '') rowArr.push('_');
			else rowArr.push(el.value);
		});
		inWrongSpot.push(rowArr.join(''));
	});

	Array.from(rightSpotInput.children).forEach((el) => {
		if (el.value.replace(/\s/g, '') == '') inRightSpot += '_';
		else inRightSpot += el.value;
	});

	fetch(
		'/getPossibleAnswers?n=' +
			notInWord +
			'&w=' +
			inWrongSpot.join(',') +
			'&r=' +
			inRightSpot
	).then((res) => {
		res.json().then((possibleAnswers) => {
			if (possibleAnswers.length === 0)
				possibleAnswers.push('no answer found');
			document.getElementById('possibleAnswers').innerText =
				possibleAnswers.join(', ');
		});
	});
}
