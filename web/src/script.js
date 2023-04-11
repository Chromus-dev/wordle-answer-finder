// autotab
document.querySelectorAll('.autotab').forEach((parent) => {
	Array.from(parent.children).forEach((el, i) => {
		el.setAttribute('onkeyup', 'autoTab(event, this)');
		el.setAttribute('maxlength', '1');
		el.setAttribute('data-index', i);
	});
});

//TODO add holding down backspace
//! fix backspace deleting previous input
function autoTab(event, el) {
	let toFocusEl = el.nextElementSibling;
	let upDown = false;

	if (event.code.startsWith('Arrow')) {
		if (event.code === 'ArrowRight') toFocusEl = el.nextElementSibling;
		if (event.code === 'ArrowLeft') toFocusEl = el.previousElementSibling;
		if (event.code === 'ArrowUp' || event.code === 'ArrowDown')
			upDown = true;
	}

	// if not a letter or backspace return
	if (
		!event.code.startsWith('Key') &&
		event.code !== 'Backspace' &&
		!event.code.startsWith('Arrow')
	)
		return;

	let backspace = false;
	if (event.key === 'Backspace') {
		toFocusEl = el.previousElementSibling;
		backspace = true;
	}

	if (!toFocusEl) {
		// if the next row has all the same classes, set toFocusEl to the first child of that row
		// ex end of row going to next when there are multiple worngSpot rows
		let toFocusParent = backspace
			? el.parentElement.previousElementSibling
			: el.parentElement.nextElementSibling;
		if (
			Array.from(el.parentElement.classList).every((c) => {
				return toFocusParent.classList.contains(c);
			})
		) {
			toFocusEl =
				toFocusParent.children[
					backspace ? toFocusParent.children.length - 1 : 0
				];
		} else return;
	}

	if (upDown) {
		let toFocusParent =
			event.code === 'ArrowUp'
				? el.parentElement.previousElementSibling
				: el.parentElement.nextElementSibling;

		toFocusEl = toFocusParent.children[el.dataset.index];
	}

	if (backspace && el.value == '') toFocusEl.value = '';
	if (toFocusEl.parentElement.classList.contains('autotab'))
		toFocusEl.focus();
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
		el.setAttribute('type', 'text');
		el.setAttribute('onkeyup', 'autoTab(event, this)');
		el.setAttribute('maxlength', '1');
		el.setAttribute('data-index', i);

		parent.appendChild(el);
	}

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
			document.getElementById('possibleAnswers').innerText =
				possibleAnswers.join(', ');
		});
	});
}
