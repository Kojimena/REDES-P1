import { createContext, use, useContext, useState, useEffect } from 'react';
import XmppService from '@/services/xmppService';

const XmppContext = createContext({
    xmpp: null,
    roster: [],
    login: () => {} ,
    alreadyLogged: false,
    invitations: [],
    conversationsUpdate: {},
});

export const XmppProvider = ({ children }) => {
    const [xmpp, setXmpp] = useState(null);
    const [alreadyLogged, setAlreadyLogged] = useState(false);
    const [roster, setRoster] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [conversationsUpdate, setConversationsUpdate] = useState({});
    const [myPresence, setMyPresence] = useState('');
    const [contactStatus, setContactStatus] = useState({});


    useEffect(() => {
        if (xmpp) {
            // Suscribirse a los eventos solo cuando xmpp está configurado
            const handleMessages = (conversations) => {
                setConversationsUpdate(prev => ({ ...prev, ...conversations }));
            };

            xmpp.on('messageReceived', handleMessages);

            return () => {
                xmpp.off('messageReceived', handleMessages);
            };
        }
    }, [xmpp]);

    /**
     * Function to login to xmpp
     * @param {any} username
     * @param {any} password
     * @returns {any}
     */
    const login = (username, password) => {
        console.log('LOOOOOOOOG')
        console.log(alreadyLogged)
        const service = new XmppService(username, password);
        service.on('rosterUpdated', updatedRoster => {
            setRoster(updatedRoster);
        });
        service.on('invitationReceived', (jid) => {
            setInvitations(prev => [...prev, jid]); 
        });
        service.on('invitationAccepted', (jid) => {
            setInvitations(prev => prev.filter(invitation => invitation !== jid));
        });
        service.on('online', () => {
            console.log('Connected as: ', username);
        });
        service.on('offline', () => {
            console.log('Disconnected');
            setAlreadyLogged(false);
        });
        service.on('presenceUpdated', (presence) => {
            setMyPresence(presence);
        } );
        service.on('contactStatusUpdated', ({ from, status }) => {
            setContactStatus(prev => ({...prev, [from.split('/')[0]]: status}));
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
        <XmppContext.Provider value={{ xmpp, roster, invitations, login, register,logout, alreadyLogged, conversationsUpdate, myPresence, contactStatus }}>
            {children}
        </XmppContext.Provider>
    );
};

export const useXmpp = () => useContext(XmppContext);