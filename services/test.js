const { connect, register, logout } = require('./xmppService.js');

const jid = 'her21199@alumchat.lol';
const password = 'nutella21';


const testXmppService = async () => {
  try {
    // Conectar al servidor XMPP
    await connect(jid, password, { rejectUnauthorized: false });
    console.log('✅ Conexión exitosa');


    // Cerrar sesión
    await logout();
    console.log('✅ Cierre de sesión exitoso');
  } catch (err) {
    console.error('❌ Error en la prueba:', err.toString());
  }
};

testXmppService();