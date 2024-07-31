const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const xmpp = client({
  service: 'xmpp://alumchat.lol:5222',
  domain: 'alumchat.lol',
  resource: 'web',
  username: 'her21199',
  password: 'nutella21',
});

debug(xmpp, true);

xmpp.on('error', err => {
  console.error('❌ Error:', err.toString());
});

xmpp.on('status', status => {
  console.log('🛈 Status:', status);
});

xmpp.on('offline', () => {
  console.log('⏹ Offline');
});

xmpp.on('online', jid => {
  console.log('▶ Online as', jid.toString());
});

xmpp.on('stanza', async stanza => {
  if (stanza.is('message')) {
    console.log('📩 Message:', stanza.toString());
  }
});

const connect = async (jid, password) => {
  xmpp.options.username = jid.split('@')[0];  // Extraer el nombre de usuario del JID
  xmpp.options.password = password;
  console.log(xmpp.username, xmpp.password);
  try {
    console.log('Connecting...', xmpp );
    await xmpp.start();
    console.log('Connected');
  } catch (err) {
    console.error('❌ Connection error:', err.toString());
  }
};


const register = async (username, password) => {
  try {
    const domain = 'alumchat.lol';
    const registration = xml('iq', { type: 'set', to: domain },
      xml('query', { xmlns: 'jabber:iq:register' },
        xml('username', {}, username),
        xml('password', {}, password)
      )
    );
    await xmpp.send(registration);
    console.log('Registration request sent');
  } catch (err) {
    console.error('❌ Registration error:', err.toString());
  }
};

const logout = async () => {
  try {
    await xmpp.stop();
    console.log('Logged out');
  } catch (err) {
    console.error('❌ Logout error:', err.toString());
  }
};

module.exports = { connect, register, logout };