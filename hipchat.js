const XmppClient = require('node-xmpp-client');
let api = null,
    xmppClientInstance = null;

exports.load = () => {
    exports.config.commandPrefix = exports.config.commandPrefix || '/';
    exports.config.connectHost = exports.config.connectHost || 'chat.hipchat.com';
    exports.config.conferenceDomain = exports.config.conferenceDomain || 'conf.hipchat.com';
};

exports.start = (callback) => {
    xmppClientInstance = new XmppClient({
		jid: `${exports.config.xmppJid}@${exports.config.connectHost}/bot`,
		password: exports.config.password
	});
    xmppClientInstance.connection.socket.setKeepAlive(true, 10000);

    class HipchatIntegration extends shim {
        sendMessage (message, thread) {
        	const t = thread.split('|'),
        		stanza = new XmppClient.Stanza('message', {to: t[0], type: t[1]}).c('body').t(message);
        	xmppClientInstance.send(stanza);
        }
    }
    api = new HipchatIntegration(exports.config.commandPrefix);

	xmppClientInstance.on('online', () => {
		const onlineStatusUpdate = new XmppClient.Stanza('presence', {type: 'available'}).c('show').t('chat');
		xmppClientInstance.send(onlineStatusUpdate);

		const rooms = exports.config.roomJids;
		for (let i = 0; i < rooms.length; i++) {
			const joinRoom = new XmppClient.Stanza('presence', {to: `${rooms[i]}@${exports.config.conferenceDomain}/${exports.config.roomNickname}`})
				.c('x', {xmlns: 'http://jabber.org/protocol/muc'});
			xmppClientInstance.send(joinRoom);
		}
	});

	xmppClientInstance.on('stanza', (stanza) => {
		if (stanza.attrs.type === 'error') {
			console.error('Hipchat returned an error:');
			console.error(JSON.stringify(stanza, null, 2));
			return;
		}
        console.log(stanza)
		if (stanza.is('message') && stanza.attrs.type.endsWith('chat')) {
			const body = stanza.getChildText('body'),
				senderId = stanza.attrs.from,
				senderName = senderId.substring(senderId.indexOf('/') + 1),
				threadId = senderId + '|' + stanza.attrs.type;
			if (body === null) {
                return;
            }
			callback(api, shim.createEvent(threadId, senderId, senderName, body));
		}
	});
};

exports.stop = () => {
    api = null;
	xmppClientInstance.end();
	xmppClientInstance = null;
};

exports.getApi = () => api;
