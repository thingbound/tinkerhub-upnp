'use strict';

const ssdp = require('tinkerhub-ssdp');
const EventEmitter = require('events').EventEmitter;

const fetch = require('node-fetch');
const xml2js = require('xml2js');

const Service = require('./service');

class Browser {
	constructor(searchType) {
		this._events = new EventEmitter();

		this._ssdp = ssdp.browser(searchType);
		this._ssdp.on('available', this._available.bind(this));
		this._ssdp.on('unavailable', this._unavailable.bind(this));

		this._devices = {};
	}

	on(event, cb) {
		this._events.on(event, cb);
	}

	off(event, cb) {
		this._events.off(event, cb);
	}

	start() {
		this._ssdp.start();
	}

	stop() {
		this._ssdp.stop();
	}

	_available(ssdpDevice) {
		let device = this._devices[ssdpDevice.usn];
		if(! device) {
			device = this._devices[ssdpDevice.usn] = {};
		}

		device.ssdp = ssdpDevice;
		device.public = {};

		function set(name, d, t) {
			t[name] = d[name] ? d[name][0] : null;
		}

		if(! device.handle) {
			device.handle = fetch(ssdpDevice.location)
				.then(res => {
					return res.text();
				}).then(text => {
					xml2js.parseString(text, (err, data) => {
						let deviceData = data.root.device[0];
						set('deviceType', deviceData, device.public);
						set('friendlyName', deviceData, device.public);
						set('manufacturer', deviceData, device.public);
						set('manufacturerURL', deviceData, device.public);
						set('UDN', deviceData, device.public);

						if(deviceData.serviceList[0].service) {
							device.public.services = deviceData.serviceList[0].service.map(o => {
								return new Service(o);
							});
						} else {
							device.public.services = [];
						}

						device.public.xml = deviceData;
						device.handle = null;
						this._events.emit('available', device.public);
					});
				})
				.catch(() => {
					device.handle = null;
				});
		}
	}

	_unavailable(ssdpDevice) {
		const device = this._devices[ssdpDevice.usn];
		if(! device) return;

		this._events.emit('unavailable', device.public);
	}
}

module.exports = Browser;
