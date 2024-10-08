const XmppService = require('./xmppService.js');

const jid = 'her21002';
const password = 'nutella21';

const newJid = 'test1001';
const newPassword = 'nutella10';

const testXmppService = async () => {
  const xmppService = new XmppService(jid, password);

  try {
    await xmppService.connect(jid, password, { rejectUnauthorized: false });
    console.log('✅ Conexión exitosa');

    await xmppService.sendMessage('her21199@alumchat.lol', 'Hola, soy her21002');
    await xmppService.getRoster(jid);

    await xmppService.register(newJid, newPassword);

    //wait 10 seconds
    console.log('✅ Operaciones completadas');
  } catch (err) {
    console.error('❌ Error en la prueba:', err.toString());
  } finally {
    // Llamar a una función de limpieza si existe, o cerrar cualquier recurso abierto aquí
    console.log('⏹️ Proceso terminado');
    process.exit();
  }
};

testXmppService();
