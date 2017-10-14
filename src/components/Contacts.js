import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

import { getContacts } from '../actions';

import '../less/Contacts.less';

@branch({
  contacts: ['contacts', 'data']
})
export default class Contacts extends Component {
  componentWillMount() {
    getContacts();
  }

  render() {
    const { contacts, match: { params: { contactId } } } = this.props;
    let content;

    if (contacts && contacts.length) {
      content = contacts.map(contact => {
        return <Contact contact={contact} key={contact.id} activeChat={contactId} />;
      });
    } else {
      content = <div className="no-contacts flex-grow">No contacts</div>;
    }

    return (
      <div className="contacts flex flex-column">
        <div className="h4 contacts-header">Contacts</div>
        <div className="contacts-list">
          {content}
        </div>
      </div>
    );
  }
}

class Contact extends Component {
  render() {
    const { contact, activeChat } = this.props;

    return (
      <LinkContainer to={{ pathname: `/chats/${contact.id}` }} className="contact">
        <Button bsSize="lg" block bsStyle={activeChat == contact.id ? 'primary' : 'default'}>
          <div className="contact-name">{contact.name}</div>
          <div className="contact-messages">({contact.total})</div>
        </Button>
      </LinkContainer>
    );
  }
}
