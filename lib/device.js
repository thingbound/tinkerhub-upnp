'use strict';

const Service = require('./service');

function pick(name, d) {
	return d[name] ? d[name][0] : null;
}

module.exports = class Device {
	constructor(def) {
		this.deviceType = pick('deviceType', def);
		this.friendlyName = pick('friendlyName', def);
		this.manufacturer = pick('manufacturer', def);
		this.manufacturerURL = pick('manufacturerURL', def);
		this.id = this.UDN = pick('UDN', def);

		this.services = [];
		if(def.serviceList && def.serviceList[0].service) {
			for(const s of def.serviceList[0].service) {
				this.services.push(new Service(s));
			}
		}

		Object.defineProperty(this, 'raw', {
			value: def,
		});
	}

	service(id) {
		for(const service of this.services) {
			if(service.id === id) {
				return service;
			}
		}

		return null;
	}
};
