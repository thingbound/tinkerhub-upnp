# UPnP browser

This library provides discovery and descriptions of UPnP-like devices.

```
const browser = require('tinkerhub-upnp')
	.browser('urn:schemas-sony-com:service:ScalarWebAPI:1');

browser.on('available', function(device) {
	console.log(device);
});

browser.on('unavailable', function(device) {
	console.log('device');
});
```
