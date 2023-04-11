const getPossibleAnswers = require('./lib');
const chalk = require('chalk');
const readline = require('readline-sync');

readline.setDefaultOptions({
	limit: /^([A-Za-z]|_){1,5}$/,
	defaultInput: '_',
	limitMessage: "You can only use characters 'a-z' and '_'. Try again.",
});

// welcome title
let welcomeTitle =
	chalk.bgGray(' W ') +
	chalk.bgGray(' O ') +
	chalk.bgYellow(' R ') +
	chalk.bgGreen(' D ') +
	chalk.bgGray(' L ') +
	chalk.bgYellow(' E ') +
	'\n' +
	chalk.bgGray(' A ') +
	chalk.bgYellow(' N ') +
	chalk.bgGray(' S ') +
	chalk.bgGray(' W ') +
	chalk.bgGreen(' E ') +
	chalk.bgGreen(' R ') +
	'\n' +
	chalk.bgGreen(' F ') +
	chalk.bgGreen(' I ') +
	chalk.bgGreen(' N ') +
	chalk.bgGreen(' D ') +
	chalk.bgGreen(' E ') +
	chalk.bgGreen(' R ');

console.log(welcomeTitle + '\n\nFind the answer to Wordle!\n');

let noSpot, wrongSpot, rightSpot;
let updating = false;
while (true) {
	let userInput = getUserInput();

	// brand new input
	if (!updating) {
		noSpot = userInput.noSpot;
		wrongSpot = [userInput.wrongSpot];
		rightSpot = userInput.rightSpot;
	} else {
		noSpot += userInput.noSpot;

		for (let i = 0; i < userInput.rightSpot.length; i++) {
			if (rightSpot[i] == undefined) rightSpot += '_';

			if (userInput.rightSpot[i] != '_' && rightSpot[i] == '_') {
				// convert string to array so you can change character at certain index
				rightSpot = rightSpot.split('');
				rightSpot[i] = userInput.rightSpot[i];
				rightSpot = rightSpot.join('');
			}
		}

		wrongSpot.push(userInput.wrongSpot);
	}

	const possibleAnswers = getPossibleAnswers(
		noSpot,
		wrongSpot,
		rightSpot,
		true
	);
	if (possibleAnswers.length > 1)
		console.log(
			chalk.green('Possible Answers: ') + possibleAnswers.join(', ')
		);
	else console.log(chalk.green('Answer: ' + possibleAnswers[0]));

	// keep updating until they say stop
	if (
		// you can only update if there are two or more possible answers
		possibleAnswers.length > 2 &&
		readline.keyInYN('Would you like to update your choices?')
	)
		updating = true;
	else process.exit();
}

function getUserInput() {
	console.log(chalk.bgGray('Letters not in the word'));
	const noSpot = readline
		.question('> ', {
			limit: /^([A-Za-z]|_)+$/,
		})
		.toLowerCase();

	console.log(
		chalk.bgYellow(
			"Letters in the wrong spot (Use '_' in place of a space)"
		)
	);
	const wrongSpot = readline.question('> ').toLowerCase().replace(/\s/g, '_');

	console.log(
		chalk.bgGreen("Letters in the right spot (Use '_' in place of a space)")
	);
	const rightSpot = readline.question('> ').toLowerCase().replace(/\s/g, '_');

	return { noSpot, wrongSpot, rightSpot };
}
