'use strict';

const ssdp = require('tinkerhub-ssdp');
const url = require('url');
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const Device = require('./device');

module.exports.browser = function(...args) {
	return ssdp.browser(...args)
		.map(fetchUPnP);
};

function resolveRoot(location) {
	const parsed = url.parse(location);
	parsed.path = null;
	parsed.query = null;
	return parsed.href;
}

function fetchUPnP(service) {
	return fetch(service.location)
		.then(res => {
			return res.text();
		}).then(text => {
			return new Promise((resolve, reject) => {
				xml2js.parseString(text, (err, data) => {
					if(err) {
						reject(err);
						return;
					}

					let deviceData = data.root.device[0];
					let url = data.root.URLBase ? data.root.URLBase[0] : resolveRoot(service.location);
					resolve(new Device(service, url, deviceData))
				});
			});
		});
}
