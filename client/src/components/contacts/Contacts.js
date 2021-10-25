import React, { Fragment, useContext } from 'react';
import ContactItam from './ContactItam';
import ContactContext from '../../context/contact/contactContext';

const Contacts = () => {
    const contactContext = useContext(ContactContext);

    const { contacts } = contactContext;

    return (
        <Fragment>
            {contacts.map(contact => <ContactItam key={contact.id} contact={contact} />)}
        </Fragment>
    )
}

export default Contacts;
