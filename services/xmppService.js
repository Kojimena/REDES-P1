const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');
const EventEmitter = require('events');


class XmppService extends EventEmitter{
  constructor(username, password) {
    super();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    this.username = username;
    this.password = password;
    this.roster = new Set();
    this.connecting = false;
    this.conversations = {};


    this.xmpp = client({
      service: 'ws://alumchat.lol:7070/ws',
      domain: 'alumchat.lol',
      resource: 'web',
      username: this.username,
      password: this.password,
    });

    debug(this.xmpp, true);

    this.xmpp.on('error', err => {
      console.error('❌ Error:', err.toString());
      this.connecting = false;
    });

    this.xmpp.on('status', status => {
      console.log('🛈 Status:', status);
    });

    this.xmpp.on('offline', () => {
      console.log('⏹ Offline');
      this.connecting = false;
      setTimeout(() => { () => this.connect(this.username, this.password) }, 5000);
    });

    this.xmpp.on('online', async (jid) => {
      console.log('▶ Online as', jid.toString());
      await this.xmpp.send(xml('presence')); 
      await new Promise(resolve => setTimeout(resolve, 1000));  
      this.getRoster();
      this.emit('online');
    });

    this.xmpp.on('stanza', async (stanza) => {
      if (stanza.is('message') && stanza.getChild('body')) {
        const body = stanza.getChild('body').text();
        const from = stanza.attrs.from;
        console.log('📩 Message from', from, ':', body);
        this.conversations[from] = this.conversations[from] ? [...this.conversations[from], body] : [body];

        this.emit('messageReceived', this.conversations);

      } else if (stanza.is('iq') && stanza.attrs.type === 'result' && stanza.attrs.id === 'roster_1') {
        console.log('📩 IQ result:', stanza.toString());
        this.handleRoster(stanza);
      } else if (stanza.is('iq') && stanza.attrs.type === 'set' && stanza.getChild('query') && stanza.getChild('query').attrs.xmlns === 'jabber:iq:roster') {
        console.log('📩 Rosterrrrrrrrrr:', stanza.toString());
      } else if (stanza.is('presence')&& stanza.attrs.type === 'subscribe') {
            const from = stanza.attrs.from;
            console.log('📩 Subscription request from:', from);
            this.emit('invitationReceived', from);
      } else {
        console.log('----:', stanza.toString());
      }
    });
    

  }



  async connect(jid, password) {
    if (this.connecting) return;
    this.connecting = true;
    this.xmpp.options.username = jid.split('@')[0];
    this.xmpp.options.password = password;
    try {
      console.log('Connecting...', this.xmpp);
      await this.xmpp.start();
      console.log('Connected');
    } catch (err) {
      console.error('❌ Connection error:', err.toString());
      this.connecting = false;
    }
  }    

  async register(jid, password) {
      try {
        const stanza = xml(
          'iq',
          { type: 'set', id: 'register_1' },
          xml(
            'query',
            { xmlns: 'jabber:iq:register' },
            xml('username', {}, jid),
            xml('password', {}, password)
          )
        );
        await this.xmpp.send(stanza);
        console.log('📩 Register sent');
      } catch (err) {
        console.error('❌ Register error:', err.toString());
      }
  }

    /**
   * Function to handle roster
   * @param {any} stanza
   * @returns {any}
   */
  handleRoster(stanza) {
    const stanzaId = stanza.attrs.id;
    if (stanzaId === 'roster_1') {
        const query = stanza.getChild('query');
        if (query) {
            const currentRoster = new Set();
            query.getChildren('item').forEach(item => {
                const jid = item.attrs.jid;
                const subscription = item.attrs.subscription;
                if (['both', 'to'].includes(subscription)) {
                    currentRoster.add(jid);
                }
            });

            this.roster = new Set([...this.roster].filter(jid => currentRoster.has(jid)));
            this.roster.forEach(jid => {
                if (!currentRoster.has(jid)) {
                    this.roster.delete(jid);
                }
            });

            currentRoster.forEach(jid => {
                if (!this.roster.has(jid)) {
                    this.roster.add(jid);
                }
            });
        }
    }
    console.log('🐹 Roster handle:', this.roster);
    this.emit('rosterUpdated', Array.from(this.roster));
  }

  async getRoster() {
    try {
      await this.xmpp.iqCaller.request(
        xml('iq', { type: 'get', id: 'roster_1' }, 
        xml('query', { xmlns: 'jabber:iq:roster' }))
        );
      console.log('🐹 Roster request sent!!!');
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

  async disconnect(jid, password) {
    this.xmpp.options.username = jid;
    this.xmpp.options.password = password;
    try {
      await this.xmpp.stop();
      console.log('Disconnected');
    } catch (err) {
      console.error('❌ Disconnection error:', err.toString());
    } finally {
      this.connecting = false;
    }
  }

}

module.exports = XmppService;