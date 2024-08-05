import { createContext, use, useContext, useState } from 'react';
import XmppService from '@/services/xmppService';

const XmppContext = createContext({
    xmpp: null,
    roster: [],
    login: () => {} ,
    alreadyLogged: false
});

export const XmppProvider = ({ children }) => {
    const [xmpp, setXmpp] = useState(null);
    const [alreadyLogged, setAlreadyLogged] = useState(false);
    const [roster, setRoster] = useState([]);
    const [invitations, setInvitations] = useState([]);


    const login = (username, password) => {
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
        setXmpp(service);
        service.connect(username, password);
        setAlreadyLogged(true);

    };

    const register = (username, password) => {
        const service = new XmppService("her21199", "nutella21");
        const connected = service.connect("her21199", "nutella21");
        service.on('online', () => {
            console.log('REGISTERED');

            service.register(username, password);
        });
        setAlreadyLogged(true);
    }


    return (
        <XmppContext.Provider value={{ xmpp, roster, invitations, login, register }}>
            {children}
        </XmppContext.Provider>
    );
};

export const useXmpp = () => useContext(XmppContext);