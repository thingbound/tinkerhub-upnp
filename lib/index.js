'use strict';

const ssdp = require('tinkerhub-ssdp');
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const Device = require('./device');

module.exports.browser = function(...args) {
	return ssdp.browser(...args)
		.map(fetchUPnP);
};

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

					let deviceData = data.root.device[0];;
					resolve(new Device(service, deviceData))
				});
			});
		});
}
