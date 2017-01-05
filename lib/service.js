'use strict';

function pick(name, def) {
	return def[name] ? def[name][0] : null;
}

class Service {
	constructor(def) {
		this.type = pick('serviceType', def);
		this.id = pick('serviceId', def);
		this.SCPDURL = pick('SCPDURL', def);
		this.controlURL = pick('controlURL', def);
		this.eventSubURL = pick('eventSubURL', def);
	}
}

module.exports = Service;
