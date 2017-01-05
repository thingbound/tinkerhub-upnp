'use strict';

const Browser = require('./browser');

module.exports.browser = function(searchType) {
	return new Browser(searchType);
};
