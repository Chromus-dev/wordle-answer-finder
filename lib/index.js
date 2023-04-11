const validAnswers = require('./validAnswers.json');
const chalk = require('chalk');

function getPossibleAnswers(noSpot, wrongSpot, rightSpot, colored = false) {
	noSpot = noSpot.toLowerCase();
	wrongSpot.forEach((c) => c.toLowerCase());
	rightSpot = rightSpot.toLowerCase();

	// possible answers
	let answers = [];
	validAnswers.reduce((acc, word) => {
		let characters = word.split('');

		// if it has a letter that's not in the word then not possible
		for (let i = 0; i < noSpot.length; i++) {
			if (word.includes(noSpot[i])) {
				return acc;
			}
		}

		// filter through correct spot
		for (let i = 0; i < rightSpot.length; i++) {
			if (rightSpot[i] === '_') continue;

			if (rightSpot[i] !== word[i]) {
				return acc;
			}

			if (colored) characters[i] = chalk.green(rightSpot[i]);
			else characters[i] = rightSpot[i];
		}

		// filter through wrong spot
		// it's an array because of updating the choices
		for (let j = 0; j < wrongSpot.length; j++) {
			for (let i = 0; i < wrongSpot[j].length; i++) {
				if (wrongSpot[j][i] === '_') continue;

				// if word doesn't contain the wrong spot letter then it cant be an answer
				if (!word.includes(wrongSpot[j][i])) {
					return acc;
				}

				// if it is in the wrong spot in the guess but right in the word then it cant be an answer
				if (wrongSpot[j][i] === word[i]) {
					return acc;
				}
			}
		}

		answers.push(characters.join(''));

		return acc;
	}, []);

	return answers;
}

module.exports = getPossibleAnswers;
module.exports.getPossibleAnswers = getPossibleAnswers;
module.exports.validAnswers = validAnswers;
