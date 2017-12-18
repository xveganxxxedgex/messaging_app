import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { branch } from 'baobab-react/higher-order';

import Contacts from './Contacts';
import Messages from './Messages';
import Greeting from './Greeting';

import '../less/App.less';

@branch({
  routeParams: ['routeParams']
})
export default class App extends Component {
  render() {
    const { location: { pathname }, routeParams: { contactId } } = this.props;

    return (
      <div className={`app flex flex-grow ${!!contactId ? 'on-chat-page' : ''}`}>
        <Route path="/" component={Contacts} />
        <Switch>
          <Route path="/chats/:contactId([0-9]+)" component={Messages} />
          <Route exact path="/" component={Greeting} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}
