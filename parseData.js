const fs = require('fs');
const data = require('./data.json');

let filtered = data.reduce((acc, value) => {
	if (value.validWordleAnswer !== null) acc.push(value.validWordleAnswer);
	return acc;
}, []);
console.log(filtered);

fs.writeFileSync('./validAnswers.json', JSON.stringify(filtered, null, '\t'));
