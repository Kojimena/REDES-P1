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
    this.presence = '';
    this.groupConversations = {};
    this.history_messages = {};


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
    });

    this.xmpp.on('status', status => {
      console.log('🛈 Status:', status);
    });

    this.xmpp.on('offline', () => {
      console.log('⏹ Offline');
      this.connecting = false;
      setTimeout(() => { () => window.location.reload(); }, 5000);
    });

    this.xmpp.on('online', async (jid) => {
      console.log('▶ Online as', jid.toString());
      await this.updatePresence('chat', 'Available for chat');
      this.presence = "Available for chat";
      this.emit('presenceUpdated', this.presence);
      await new Promise(resolve => setTimeout(resolve, 1000));  
      this.getRoster();
      this.emit('online');
    });

    this.xmpp.on('stanza', async (stanza) => {
      if (stanza.is('message') && stanza.getChild('body')) {
        const body = stanza.getChild('body').text();
        const from = stanza.attrs.from;
        const isGroupChat = stanza.attrs.type === 'groupchat'; // Verificar si es un mensaje de chat grupal
    
        console.log('📩 Message from', from, ':', body);
    
        if (isGroupChat) {
          this.groupConversations = this.groupConversations || {};
          const groupJid = from.split('/')[0];
          const senderJid = from.split('/')[1];
      
          if (!this.groupConversations[groupJid]) {
              this.groupConversations[groupJid] = [];
          }
      
          this.groupConversations[groupJid].push({ sender: senderJid, message: body });
          console.log('📩 Group Conversations:', this.groupConversations);
          this.emit('groupMessageReceived', this.groupConversations);
        } else {
            this.conversations[from] = this.conversations[from] ? [...this.conversations[from], body] : [body];
            console.log('📩 Conversations:', this.conversations);
            this.emit('messageReceived', this.conversations);
        }
    } else if (stanza.is('iq') && stanza.attrs.type === 'result' && stanza.attrs.id === 'roster_1') {
        console.log('📩 IQ result:', stanza.toString());
        this.handleRoster(stanza);

    } else if (stanza.is('iq') && stanza.attrs.type === 'set' && stanza.getChild('query') && stanza.getChild('query').attrs.xmlns === 'jabber:iq:roster') {
        console.log('📩 Rosterrrrrrrrrr:', stanza.toString());
        const item = stanza.getChild('query').getChild('item');
        const jid = item.attrs.jid;
        const subscription = item.attrs.subscription;
        switch (subscription) {
            case 'none':
              this.emit('notificationReceived', jid + ' has removed you from their contacts');
              break;
        }

    } else if (stanza.is('presence')&& stanza.attrs.type === 'subscribe') {
            const from = stanza.attrs.from;
            console.log('📩 Subscription request from:', from);
            this.emit('invitationReceived', from);

    } else if (stanza.is('presence') && stanza.attrs.from !== this.xmpp.options.jid) {
        const from = stanza.attrs.from;
        const status = stanza.getChild('status')? stanza.getChild('status').text() : '';
        const show = stanza.getChild('show') ? stanza.getChild('show').text() : 'Available';
        console.log('👾 Presence from', from, ':', status);
        if (from.split('@')[0] !== this.xmpp.options.username && !from.includes('conference')) {
          switch (show) {
            case 'chat':
              this.emit('contactStatusUpdated', { from, status, show: 'Available for chat' });
              this.emit('notificationReceived', 'User ' + from + ' is Available for chat');
              break;
            case 'away':
              this.emit('contactStatusUpdated', { from, status, show: 'Away' });
              this.emit('notificationReceived', 'User ' + from + ' is away');
              break;
            case 'dnd':
              this.emit('contactStatusUpdated', { from, status, show: 'Do not disturb' });
              this.emit('notificationReceived', 'User ' + from + ' is busy');
              break;
            case 'xa':
              this.emit('contactStatusUpdated', { from, status, show: 'Extended away' });
              this.emit('notificationReceived', 'User ' + from + ' is away for an extended period');
              break;
            default:
              this.emit('contactStatusUpdated', { from, status, show: 'Available' });
              this.emit('notificationReceived', 'User ' + from + ' is online');
              break;
          }
        }
    }else if (stanza.is('message') && stanza.getChild('x', 'http://jabber.org/protocol/muc#user')) {
              const invite = stanza.getChild('x', 'http://jabber.org/protocol/muc#user').getChild('invite');
              if (invite) {
                  const from = invite.attrs.from;
                  const roomJid = stanza.getChild('x', 'jabber:x:conference').attrs.jid;
                  console.log(`Invitación recibida de ${from} para unirse a ${roomJid}`);
                  this.emit('roomInvitationReceived',roomJid);
              }
    } else if  (stanza.is('presence') && stanza.getChild('x', 'http://jabber.org/protocol/muc#user')) {
        const item = stanza.getChild('x', 'http://jabber.org/protocol/muc#user').getChild('item');
        const status = stanza.getChild('x', 'http://jabber.org/protocol/muc#user').getChildren('status');
        if (item.attrs.affiliation === 'member' && item.attrs.role === 'participant') {
            const roomJid = stanza.attrs.from;
            console.log(`Unido a la sala: ${roomJid}`);
            this.emit('roomJoined',roomJid);
        }
    } else if (stanza.is('message') && stanza.getChild('event', 'http://jabber.org/protocol/pubsub#event')) {
        const eventElement = stanza.getChild('event', 'http://jabber.org/protocol/pubsub#event');
          const items = eventElement.getChild('items');
          if (items && items.attrs.node === 'storage:bookmarks') {
              const item = items.getChild('item');
              if (item) {
                  const storage = item.getChild('storage', 'storage:bookmarks');
                  if (storage) {
                      const conference = storage.getChild('conference');
                      if (conference) {
                          const jid = conference.attrs.jid;
                          const nick = conference.getChildText('nick');
                          const autojoin = conference.attrs.autojoin === 'true';
                          console.log(`Bookmark found: JID=${jid}, Nick=${nick}, Autojoin=${autojoin}`);
                          this.saveBookmark(jid, nick, autojoin);
                      }
                  }
              }
          }
      }  else if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2') && stanza.getChild('result', 'urn:xmpp:mam:2').attrs.queryid === 'mam_query_1') {
        console.log('📩 MAM query response:', stanza.toString());
        const result = stanza.getChild('result', 'urn:xmpp:mam:2');
        const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
        if (forwarded) {
            const message = forwarded.getChild('message', 'jabber:client');
            const body = message.getChild('body').text();
            const from = message.attrs.from;
            console.log('📩 Archived message from', from, ':', body);
            this.history_messages[from] = this.history_messages[from] ? [...this.history_messages[from], body] : [body];
            this.emit('historyReceived', this.history_messages);
        }
    }
      else {
        console.log('----:', stanza.toString());
      }
    });
    
  }

  /**
   * Set initial presence status
   * @param {string} show - Optional, can be 'chat', 'away', 'dnd', 'xa'
   * @param {string} status - Optional, text message representing status message
   */
  async setPresence(show = '', status = '') {
    try {
      const presence = xml('presence', {},
        show ? xml('show', {}, show) : null,
        status ? xml('status', {}, status) : null
      );
      await this.xmpp.send(presence);
      console.log('Presence set:', { show, status });
    } catch (err) {
      console.error('❌ Error setting presence:', err.toString());
    }
  }


  /**
   * Update presence status
   * @param {string} show - Optional, can be 'chat', 'away', 'dnd', 'xa'
   * @param {string} status - Optional, text message representing status message
   */
  async updatePresence(show = '', status = '') {
    this.setPresence(show, status);
    this.presence = status;
    this.emit('presenceUpdated', this.presence);
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
      this.emit('errorconnecting');
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
      this.conversations[to] = this.conversations[to] ? [...this.conversations[to],"Me: "+message] : ["Me: "+message];
      this.emit('messageReceived', this.conversations);
    } catch (err) {
      console.error('❌ Message error:', err.toString());
    }
  }

  async retrieveArchivedMessages(jid, max = 40) {
    const queryId = 'mam_query_1';
    try {
      const mamQuery = xml('iq', { type: 'set', id: queryId },
        xml('query', { xmlns: 'urn:xmpp:mam:2', queryid: queryId },
          xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
            xml('field', { var: 'FORM_TYPE', type: 'hidden' },
              xml('value', {}, 'urn:xmpp:mam:2')
            ),
            xml('field', { var: 'with' },
              xml('value', {}, jid.split('/')[0])
            )
          ),
          xml('set', { xmlns: 'http://jabber.org/protocol/rsm' },
            xml('max', {}, max.toString())
          )
        )
      );
      const response = await this.xmpp.iqCaller.request(mamQuery);
      console.log('MAM query response:', response.toString());
      console.log('MAM query sent:', mamQuery.toString());
    } catch (err) {
      console.error('Error retrieving archived messages:', err.toString());
    }
  }
  
  

  sendMessageToRoom(roomJid, message) {
    try {
      const stanza = xml('message', {to: roomJid, type: 'groupchat'}, xml('body', {}, message));
      this.xmpp.send(stanza);
      this.emit('groupMessageReceived', this.groupConversations);
    } catch (err) {
      console.error('Error sending message to group chat:', err.toString());
    }
  }
  


  async acceptInvitation(jid) {
    try {
      const stanza = xml('presence', { to: jid, type: 'subscribed' });
      await this.xmpp.send(stanza);
      this.emit('invitationAccepted', jid);
      console.log('Invitation accepted');
    } catch (err) {
      console.error('❌ Accept invitation error:', err.toString());
    }
  }    

  async removeContact(jid) {
    try {
      const removeStanza = xml('iq', { type: 'set', id: 'removeContact_1' },
        xml('query', { xmlns: 'jabber:iq:roster' },
          xml('item', { jid: jid, subscription: 'remove' })
        )
      );
      await this.xmpp.send(removeStanza);
      console.log('Contact removal requested for:', jid);
  
      this.roster.delete(jid);
      this.emit('rosterUpdated', Array.from(this.roster));
    } catch (err) {
      console.error('❌ Error removing contact:', err.toString());
    }
  }

  async sendSubscriptionRequest(jid) {
    try {
      const stanza = xml('presence', { to: jid, type: 'subscribe' });
      await this.xmpp.send(stanza);
      console.log('Subscription request sent to:', jid);
      this.emit('notificationReceived', 'Subscription request sent to ' + jid);
    } catch (err) {
      console.error('❌ Subscription request error:', err.toString());
    }
  }

  async joinRoom(roomJid, nickname) {
    const presence = xml('presence', {
        to: `${roomJid}/${nickname}`
    }, xml('x', { xmlns: 'http://jabber.org/protocol/muc' }));
    try {
        await this.xmpp.send(presence);
        console.log(`Unido a la sala: ${roomJid} como ${nickname}`);
        this.emit('roomJoined', roomJid);
    } catch (err) {
        console.error('Error al unirse a la sala:', err.toString());
    }
  }


  saveBookmark(jid, nick, autojoin) {
    if (autojoin) {
        this.joinRoom(jid, this.xmpp.options.username);
    }
  }

  clearHistory() {
    this.history_messages = {};
    this.emit('historyReceived', this.history_messages);
  }

  async disconnect() {
    console.log('Iniciando la desconexión...');
    this.xmpp.stop().then(() => {
        console.log('Desconexión completada');
        this.emit('offline');
    }).catch(err => {
        console.error('Error al desconectar:', err.toString());
    });
}

}

module.exports = XmppService;