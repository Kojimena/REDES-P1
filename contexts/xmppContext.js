import { createContext, use, useContext, useState } from 'react';
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
        service.on('online', () => {
            console.log('Connected as: ', username);
        });
        service.on('offline', () => {
            console.log('Disconnected');
            setAlreadyLogged(false);
        });
        service.on('messageReceived', (conversations) => {
            setConversationsUpdate(conversations);
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