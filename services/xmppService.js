const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');
class XmppService {
  constructor(username, password) {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    this.username = username;
    this.password = password;

    this.xmpp = client({
      service: 'xmpp://alumchat.lol:5222',
      domain: 'alumchat.lol',
      resource: 'web',
      username: this.username,
      password: this.password,
    });

    debug(this.xmpp, true);

    this.xmpp.on('error', err => {
      console.error('❌ Error:', err.toString());
    });

    this.xmpp.on('status', status => {
      console.log('🛈 Status:', status);
    });

    this.xmpp.on('offline', () => {
      console.log('⏹ Offline');
    });

    this.xmpp.on('online', jid => {
      console.log('▶ Online as', jid.toString());
    });

    this.xmpp.on('stanza', async stanza => {
      if (stanza.is('message')) {
        console.log('📩 Message:', stanza.toString());
      }
    });
  }

  async connect(jid, password) {
    this.xmpp.options.username = jid.split('@')[0];
    this.xmpp.options.password = password;
    try {
      console.log('Connecting...', this.xmpp);
      await this.xmpp.start();
      console.log('Connected');
    } catch (err) {
      console.error('❌ Connection error:', err.toString());
    }
  }

  async register(username, password) {
    try {
      const domain = 'alumchat.lol';
      const registration = xml('iq', { type: 'set', to: domain },
        xml('query', { xmlns: 'jabber:iq:register' },
          xml('username', {}, username),
          xml('password', {}, password)
        )
      );
      await this.xmpp.send(registration);
      console.log('Registration request sent');
    } catch (err) {
      console.error('❌ Registration error:', err.toString());
    }
  }

  async logout() {
    try {
      await this.xmpp.stop();
      console.log('Logged out');
    } catch (err) {
      console.error('❌ Logout error:', err.toString());
    }
  }
}

module.exports = XmppService;