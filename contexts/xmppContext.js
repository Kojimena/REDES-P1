import { createContext, use, useContext, useState, useEffect } from 'react';
import XmppService from '@/services/xmppService';
import { useRouter } from 'next/navigation'

const XmppContext = createContext({
    xmpp: null,
    roster: [],
    login: () => {} ,
    alreadyLogged: false,
    invitations: [],
    conversationsUpdate: {},
    grupalInvitations: [],
});

export const XmppProvider = ({ children }) => {
    const [xmpp, setXmpp] = useState(null);
    const [alreadyLogged, setAlreadyLogged] = useState(false);
    const [roster, setRoster] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [conversationsUpdate, setConversationsUpdate] = useState({});
    const [grupalConversations, setGrupalConversations] = useState({});
    const [myPresence, setMyPresence] = useState('');
    const [contactStatus, setContactStatus] = useState({});
    const [grupalInvitations, setGrupalInvitations] = useState([]);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState([]);
    const router = useRouter();


    useEffect(() => {
        if (xmpp) {
            // Suscribirse a los eventos solo cuando xmpp está configurado
            const handleMessages = (conversations) => {
                setConversationsUpdate(prev => ({ ...prev, ...conversations }));
            };

            const handleGrupalMessages = (conversations) => {
                setGrupalConversations(prev => ({ ...prev, ...conversations }));
            };

            xmpp.on('messageReceived', handleMessages);
            xmpp.on('groupMessageReceived', handleGrupalMessages);

            return () => {
                xmpp.off('messageReceived', handleMessages);
                xmpp.off('groupMessageReceived', handleGrupalMessages);
            };
        }
    }, [xmpp]);


    useEffect(() => {
        const handleUnload = (event) => {
            if (xmpp) {
                localStorage.setItem('reconnect', 'true'); 
                setTimeout(() => {
                    xmpp.disconnect();
                } , 10000);
                event.returnValue = "Estás cerrando la página. Desconectando la sesión XMPP.";
            }
        };
    
        window.addEventListener('beforeunload', handleUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            localStorage.removeItem('reconnect'); 
        };
    }, [xmpp]);
    

    /**
     * Function to login to xmpp
     * @param {any} username
     * @param {any} password
     * @returns {any}
     */
    const login = (username, password) => {
        console.log('Intentando iniciar sesión');
        if (alreadyLogged) {
            console.log('Ya existe una sesión activa. Evitando la reconexión.');
            return;
        }
        const service = new XmppService(username, password);
        service.on('rosterUpdated', updatedRoster => {
            setRoster(updatedRoster);
        });
        service.on('invitationReceived', (jid) => {
            setInvitations(prev => [...prev, jid]); 
            setNotification(prev => [...prev, "Invitation received from " + jid + ",check your invitations."]);
        });
        service.on('roomInvitationReceived', (roomJid) => {
            setGrupalInvitations(prev => [...prev, roomJid]);
        });
        service.on('roomJoined', (roomJid) => {
            setGrupalInvitations(prev => prev.filter(invitation => invitation !== roomJid));
        }
        );
        service.on('errorconnecting', () => {
            setError('Usuario o contraseña incorrectos');
        });
        service.on('invitationAccepted', (jid) => {
            setInvitations(prev => prev.filter(invitation => invitation !== jid));
            setNotification(prev => [...prev, "User:" + jid + ", now can see your presence."]);
        });
        service.on('online', () => {
            console.log('Connected as: ', username);
            setAlreadyLogged(true);
            router.push('/chat');
        });
        service.on('offline', () => {
            console.log('Disconnected');
            setAlreadyLogged(false);
        });
        service.on('presenceUpdated', (presence) => {
            setMyPresence(presence);
        } );
        service.on('contactStatusUpdated', ({ from, status, show }) => {
            setContactStatus(prev => ({...prev, [from.split('/')[0]]: status}));
            setNotification(prev => [...prev, "User " + from.split('/')[0] + ", status:" + status +  ", show:" + show]);
        } );  
        service.on('notificationReceived', (message) => {
            setNotification(prev => [...prev, message]);
        }
        );
        setXmpp(service);
        service.connect(username, password);
        setAlreadyLogged(true);
    };

    /**
     * Function to register to xmpp
     * @param {any} username
     * @param {any} password
     * @returns {any}
     */
    const register = (username, password) => {
        const service = new XmppService("her21199", "nutella21");
        service.on('online', () => {
            console.log('REGISTERED');

            service.register(username, password);
        });
    };

    /**
     * Function to logout from xmpp
     * @param {any} username
     * @param {any} password
     * @returns {any}
     */
    const logout = (username, password) => {
        xmpp.disconnect(username, password);
        setAlreadyLogged(false);
    }


    return (
        <XmppContext.Provider value={{ xmpp,
        roster,
        invitations,
        login,
        register,
        logout,
        alreadyLogged,
        conversationsUpdate,
        myPresence,
        contactStatus,
        grupalInvitations,
        error,
        notification,
        grupalConversations }}>
        {children}
        </XmppContext.Provider>
    );
};

export const useXmpp = () => useContext(XmppContext);