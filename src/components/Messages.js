import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Button, FormGroup, FormControl, Well, Form } from 'react-bootstrap';
import _debounce from 'lodash/debounce';
import moment from 'moment';

import { getMessages, sendMessage } from '../actions';

import '../less/Messages.less';

@branch({
  messages: ['messages', 'data'],
  user: ['user', 'data']
})
export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.updateNewMessage = this.updateNewMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.scrollToLastMessage = _debounce(this.scrollToLastMessage.bind(this), 100);

    this.state = {};
  }

  componentWillMount() {
    const { match: { params: { contactId } } } = this.props;

    if (contactId != undefined) {
      getMessages(contactId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params: { contactId } }
    } = nextProps;
    const {
      match: { params: { contactId: prevContactId } }
    } = this.props;

    if (contactId != prevContactId) {
      getMessages(contactId);
    }
  }

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    const { messages: prevMessages } = prevProps;

    // When messages change, scroll to the latest message
    if (messages != prevMessages) {
      this.scrollToLastMessage();
    }
  }

  scrollToLastMessage() {
    if (this.messageHistory) {
      // Total history height
      const scrollHeight = this.messageHistory.scrollHeight;
      // Visible height
      const height = this.messageHistory.clientHeight;
      // Difference to scroll
      const maxScrollTop = scrollHeight - height;
      this.messageHistory.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }

  updateNewMessage(e) {
    this.setState({ newMessage: e.target.value });
  }

  handleKeyPress(e) {
    // Submit message on enter
    if (e.key == 'Enter') {
      // Don't submit on shift + enter
      if (!this.state.shiftPressed) {
        e.preventDefault();
        this.sendMessage();
      }
    }
  }

  handleKeyDown(e) {
    // Set state when shift is held down
    if (e.key == 'Shift') {
      this.setState({ shiftPressed: true });
    }
  }

  handleKeyUp(e) {
    if (e.key == 'Shift') {
      this.setState({ shiftPressed: false });
    }
  }

  sendMessage() {
    const { match: { params: { contactId } } } = this.props;
    sendMessage(contactId, this.state.newMessage);
    this.setState({ newMessage: '' });
  }

  render() {
    const { messages, user } = this.props;
    let content;

    if (messages && messages.length) {
      content = messages.map((message, index) => {
        const messageType = message.sender_user == user.id ? 'outgoing' : 'incoming';
        return <Message message={message} key={index} messageType={messageType} />;
      })
    } else {
      content = <div className="no-messages flex flex-grow">No chat history</div>
    }

    return (
      <div className="messages flex flex-grow flex-column">
        <div className="history flex flex-grow flex-column" ref={node => { this.messageHistory = node }}>
          {content}
        </div>
        <Form className="send-message flex flex-row">
          <FormGroup className="flex flex-grow">
            <FormControl
              componentClass="textarea"
              className="flex flex-grow"
              placeholder="Send a message..."
              onChange={this.updateNewMessage}
              onKeyPress={this.handleKeyPress}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              value={this.state.newMessage}
            />
          </FormGroup>
          <Button bsSize="sm" onClick={this.sendMessage}>Send</Button>
        </Form>
      </div>
    );
  }
}

class Message extends Component {
  render() {
    const { message, messageType } = this.props;

    return (
      <Well className={`message ${messageType}`}>
        <div className="message-body">{message.text}</div>
        <div className="message-sent text-muted"><small>Sent: {moment(message.date).format('MM/DD h:mm a')}</small></div>
      </Well>
    );
  }
}
