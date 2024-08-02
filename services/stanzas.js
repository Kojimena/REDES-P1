const {xml, jid} = require('@xmpp/client')

const stanzas = {

    /*
    1)Registrar una nueva cuenta en el servidor
    2) Iniciar sesión con una cuenta
    3) Cerrar sesión con una cuenta
    4) Eliminar la cuenta del servidor
    1) Mostrar todos los contactos y su estado
    2) Agregar un usuario a los contactos
    3) Mostrar detalles de contacto de un usuario
    4) Comunicación 1 a 1 con cualquier usuario/contacto
    5) Participar en conversaciones grupales
    6) Definir mensaje de presencia
    7) Enviar/recibir notificaciones
    8) Enviar/recibir archivos
    */
    register: (jid, password) => {
        return xml('iq', {type: 'set', id: 'register1'}, 
            xml('query', {xmlns: 'jabber:iq:register'}, 
                xml('username', {}, jid),
                xml('password', {}, password)
            )
        )
    },

    login: (jid, password) => {
        return xml('iq', {type: 'set', id: 'login1'}, 
            xml('query', {xmlns: 'jabber:iq:auth'}, 
                xml('username', {}, jid),
                xml('password', {}, password)
            )
        )
    },

    logout: () => {
        return xml('iq', {type: 'set', id: 'logout1'}, 
            xml('query', {xmlns: 'jabber:iq:logout'})
        )
    },

    presence: (show, status) => {
        return xml('presence', {}, 
            xml('show', {}, show),
            xml('status', {}, status)
        )
    },



}

module.exports = stanzas
