const XmppService = require('./xmppService.js');

const jid = 'kojimena@tigase.im';
const password = 'nutella21';

const newJid = 'her10';
const newPassword = 'nutella10';

const testXmppService = async () => {
  const xmppService = new XmppService(jid, password);

  try {
    await xmppService.connect(jid, password, { rejectUnauthorized: false });
    console.log('✅ Conexión exitosa');

    /* await xmppService.register(newJid, newPassword);
    console.log('✅ Registro exitoso'); */

    //send message to myself
    await xmppService.sendMessage(jid, 'holi');

    await xmppService.logout();
    console.log('✅ Cierre de sesión exitoso');
  } catch (err) {
    console.error('❌ Error en la prueba:', err.toString());
  }
};

testXmppService();