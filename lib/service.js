'use strict';

const url = require('url');

function pick(name, def) {
	return def[name] ? def[name][0] : null;
}

function makeAbsolute(urlBase, d) {
	if(! d) return d;

	return url.resolve(urlBase, d);
}

class Service {
	constructor(urlBase, def) {
		this.type = pick('serviceType', def);
		this.id = pick('serviceId', def);
		this.SCPDURL = makeAbsolute(urlBase, pick('SCPDURL', def));
		this.controlURL = makeAbsolute(urlBase, pick('controlURL', def));
		this.eventSubURL = makeAbsolute(urlBase, pick('eventSubURL', def));
	}
}

module.exports = Service;
