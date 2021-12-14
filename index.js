const OBSWebSocket = require('obs-websocket-js');
exports.NetworkMod = function obsutils(d) {
	const obs = new OBSWebSocket();
	let filename, authed = false
	const locations = require('./locations.json')

	d.command.add('obs', (arg, arg2) => {
		if (arg == 'stop') obscontrol('stop')
		if (arg == 'start') obscontrol('start')
		if (arg == 'clip') obscontrol('clip')
		if (!arg) {
			d.settings.enabled = !d.settings.enabled
			d.command.message(`${d.settings.enabled ? 'enabled' : 'disabled'}`)
		}
		if (arg == 'password') {
			d.settings.password = arg2;
			d.command.message(`new password set to ${arg2} and attempting to reconnect to obs!`)
			reconnect()
		}
		if (arg == 'host') {
			d.settings.host = arg2;
			d.command.message(`new host set to ${arg2} and attempting to reconnect to obs!`)
			reconnect()
		}
		if (['connect', 'reconnect'].includes(arg)) {
			d.command.message(`attempting to connect to obs!`)
			reconnect()
		}
	})

	function reconnect() {
		obs.connect({ address: d.settings.host, password: d.settings.password })
			.then(() => { d.command.message('obs login success!'); authed = true })
			.catch(err => { d.command.message('obs login failed!'); authed = false })
	}

	obs.connect({ address: d.settings.host, password: d.settings.password })
		.then(() => { console.log(`connected to obs`); authed = true })
		.catch(err => { console.log('connection to obs failed'); authed = false })

	d.hook('S_SPAWN_ME', '*', (e) => {
		if (d.game.me.inDungeon) {
			obscontrol()
		}
	})
	d.hook('S_LOAD_TOPO', '*', (e) => {
		if (!d.game.me.inDungeon) {
			obscontrol()
		}
	})

	function obscontrol(arg) {
		if (!d.settings.enabled || !authed) return;
		obs.send('GetRecordingStatus').then(data => {
			if (arg == 'stop' && data.isRecording) stoprecording()
			if (arg == 'clip') { if (data.isRecording) stoprecording(); startrecording() }
			if (arg == 'start' && !data.isRecording) startrecording()
			if (!data.isRecording && d.game.me.inDungeon) { startrecording() }
			if (data.isRecording && !d.game.me.inDungeon) { stoprecording() }
		})
	}

	function startrecording() {
		obs.send('GetFilenameFormatting').then(data => { filename = data.filenameFormatting })
		obs.send('SetFilenameFormatting', { 'filename-formatting': `%CCYY-%MM-%DD %hh-%mm-%ss [${d.game.me.name}]${locations[d.game.me.zone] ? ' ' + locations[d.game.me.zone] : ''}` })
		obs.send('StartRecording');
		d.command.message('recording started!');
		setTimeout(() => { obs.send('SetFilenameFormatting', { 'filename-formatting': filename }) }, 150)
	}

	function stoprecording() {
		obs.send('StopRecording'); d.command.message('recording stopped!')
	}

	this.destructor = function () { obscontrol('stop') }
}
