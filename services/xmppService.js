const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');
const EventEmitter = require('events');  // Asegúrate de que EventEmitter esté importado correctamente


class XmppService extends EventEmitter{
  constructor(username, password) {
    super();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    this.username = username;
    this.password = password;
    this.roster = new Set();

    this.xmpp = client({
      service: 'wss://tigase.im:5291/xmpp-websocket',
      domain: 'tigase.im',
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
      setTimeout(() => { () => this.connect(this.username, this.password) }, 5000);
    });

    this.xmpp.on('online', async (jid) => {
      console.log('▶ Online as', jid.toString());
      await this.xmpp.send(xml('presence'));  // initial presence
      await new Promise(resolve => setTimeout(resolve, 1000));  
      this.getRoster(jid);  // fetch roster 
      this.emit('online');
    });

    this.xmpp.on('stanza', async (stanza) => {
      if (stanza.is('message') && stanza.getChild('body')) {
        const body = stanza.getChild('body').text();
        const from = stanza.attrs.from;
        console.log('📩 Message from', from, ':', body);
      } else if (stanza.is('iq') && stanza.attrs.type === 'result') {
        console.log('📩 IQ result:', stanza.toString());
        this.handleRoster(stanza);
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

  handleRoster(stanza) {
      /*
        Handler para añadir contactos a roster.
        Función utilizada en getRoster.
      */
      const stanzaId = stanza.attrs.id;
      if (stanzaId === 'roster_1') {
        const query = stanza.getChild('query');
        if (query) {
          query.getChildren('item').forEach(item => {
            const jid = item.attrs.jid;
            this.roster.add(jid);
          });
        }
      }
    console.log('🐹 Roster handle:', this.roster)
    this.emit('rosterUpdated', Array.from(this.roster)); // Send updated roster in an array

  }


  /**
   *  Request roster
   * @param jid
   * @returns  {any}
   */
  rosterRequest(jid) {
    return xml(
      'iq', 
      { type: 'get', 
        to : jid,
        id: 'roster_1' },
      xml('query', { xmlns: 'jabber:iq:roster' })
    );
  }

  /**
   * Fetch roster
   * @param {any} jid
   * @returns {any}
   */
  async getRoster(jid) {
    try {
      const rosterStanza = this.rosterRequest(jid);
      await this.xmpp.send(rosterStanza);
      console.log('🐹 Roster request sent');
      //wait 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (err) {
      console.error('❌ Roster error:', err.toString());
    }
  }
  
  /**
   * Send message to a user
   * @param {any} to
   * @param {any} message
   * @returns {any}
   */
  async sendMessage(to, message) {
    try {
      const stanza = xml('message', { to, type: 'chat' }, xml('body', {}, message));
      await this.xmpp.send(stanza);
      console.log('Message sent');
    } catch (err) {
      console.error('❌ Message error:', err.toString());
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