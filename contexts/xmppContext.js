import { createContext, useContext, useState } from 'react';
import XmppService from '@/services/xmppService';

const XmppContext = createContext({
    xmpp: null,
    roster: [],
    login: () => {} 
});

export const XmppProvider = ({ children }) => {
    const [xmpp, setXmpp] = useState(null);
    const [roster, setRoster] = useState([]);

    const login = (username, password) => {
        const service = new XmppService(username, password);
        service.on('rosterUpdated', updatedRoster => {
            setRoster(updatedRoster);
        });
        service.on('online', () => {
            console.log('Connected as: ', username);
        });
        setXmpp(service);
        service.connect(username, password);
    };

    return (
        <XmppContext.Provider value={{ xmpp, roster, login }}>
            {children}
        </XmppContext.Provider>
    );
};

export const useXmpp = () => useContext(XmppContext);