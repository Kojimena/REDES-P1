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
    const [myStatus, setMyStatus] = useState('');
    const [contactStatus, setContactStatus] = useState({});
    const [grupalInvitations, setGrupalInvitations] = useState([]);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState([]);
    const router = useRouter();


    useEffect(() => {
        if (xmpp) {
            const handleMessages = (conversations) => {
                setConversationsUpdate(prev => {
                    console.log('Conversaciones previas:', prev);
                    console.log('Nuevas conversaciones:', conversations);
            
                    const updatedConversations = { ...prev };
            
                    for (const [user, messages] of Object.entries(conversations)) {
                        if (!updatedConversations[user]) {
                            updatedConversations[user] = [];
                        }
            
                        const existingTimestamps = new Set(updatedConversations[user].map(msg => msg.timestamp));
                        const newMessages = messages.filter(msg => !existingTimestamps.has(msg.timestamp));
                        updatedConversations[user] = [...updatedConversations[user], ...newMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    }
            
                    console.log('Conversaciones actualizadas:', updatedConversations);
                    return updatedConversations;
                });
            };
                      

            const handleGrupalMessages = (conversations) => {
                setGrupalConversations(prev => ({ ...prev, ...conversations }));
            };

            const handleInvitationReceived = (jid) => {
                if (!invitations.includes(jid)) {
                    setInvitations(prev => [...prev, jid]);
                }
                const message = `Invitation received from ${jid}, check your invitations.`;
                if (!notification.includes(message)) {
                    setNotification(prev => [...prev, message]);
                }
            };

            const handleNotificationReceived = (message) => {
                if (!notification.includes(message)) {
                    setNotification(prev => [...prev, message]);
                }
            };

            xmpp.on('messageReceived', handleMessages);
            xmpp.on('groupMessageReceived', handleGrupalMessages);
            xmpp.on('invitationReceived', handleInvitationReceived);
            xmpp.on('notificationReceived', handleNotificationReceived);

            return () => {
                xmpp.off('messageReceived', handleMessages);
                xmpp.off('groupMessageReceived', handleGrupalMessages);
                xmpp.off('invitationReceived', handleInvitationReceived);
                xmpp.off('notificationReceived', handleNotificationReceived);
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
        service.on ('statusUpdated', (status) => {
            setMyStatus(status);
        } );
        service.on('contactStatusUpdated', ({ from, status, show }) => {
            setContactStatus(prev => ({...prev, [from.split('/')[0]]: {status, show}}));
        } );
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
        service.connect("her21199", "nutella21");
        service.on('online', () => {
            service.register(username, password);
        });
        setAlreadyLogged(true);
    }

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

    const clearNotification = () => {
        setNotification([]);
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
        myStatus,
        contactStatus,
        grupalInvitations,
        error,
        notification,
        clearNotification,
        grupalConversations }}>
        {children}
        </XmppContext.Provider>
    );
};

export const useXmpp = () => useContext(XmppContext);