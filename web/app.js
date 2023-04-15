const express = require('express');
const morgan = require('morgan')
const wordleAnswerFinder = require('../lib');
const { join: joinPaths } = require('path');

const PORT = 8080;

const app = express();

// req logging
app.use(morgan('short'))

app.use('/src/', express.static(joinPaths(__dirname, './src/')));

app.get('/getPossibleAnswers', (req, res) => {
	let { n: noSpot, w: wrongSpot, r: rightSpot } = req.query;

	wrongSpot = wrongSpot.split(',');

	let possibleAnswers = wordleAnswerFinder.getPossibleAnswers(
		noSpot,
		wrongSpot,
		rightSpot
	);
	res.json(possibleAnswers);
});

app.get('/', (req, res) => {
	res.sendFile(joinPaths(__dirname, './index.html'));
});

app.listen(PORT, () => console.log('listening at localhost:' + PORT));
