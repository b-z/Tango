var express = require('express');
var router = express.Router();
var tango = require('./tango').func;

router.get('/', tango.tango);
router.get('/words', tango.wordList);
router.post('/words', tango.addWord);
router.post('/AddToReviewList', tango.addToReviewList);
router.post('/WordTestClicked', tango.wordTestClicked);
router.post('/TestFinished', tango.testFinished);

module.exports = router;
