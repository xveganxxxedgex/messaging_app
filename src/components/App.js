import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { root } from 'baobab-react/higher-order';

import Contacts from './Contacts';
import Messages from './Messages';
import Greeting from './Greeting';

import '../less/App.less';

import tree from '../state';

@root(tree)
export default class App extends Component {
  constructor(props) {
    super(props);

    this.toggleIsMobile = this.toggleIsMobile.bind(this);
    this.adaptToMobile = this.adaptToMobile.bind(this);

    this.mobileMaxWidth = 768;

    this.state = {};
  }

  componentDidMount() {
    this.adaptToMobile();

    window.addEventListener('resize', this.adaptToMobile);
  }

  toggleIsMobile() {
    this.setState({ isMobile: !this.state.isMobile });
  }

  /**
   * Toggles mobile mode if browser width is below the mobile max width
   *
   * @param  {number} browserWidth - The current width of the browser
   */
  adaptToMobile() {
    const browserWidth = window.innerWidth;

    if (browserWidth < this.mobileMaxWidth) {
      if (!this.state.isMobile) {
        this.toggleIsMobile();
      }
    } else {
      if (this.state.isMobile) {
        this.toggleIsMobile();
      }
    }
  }

  render() {
    const { location: { pathname } } = this.props;
    const { isMobile } = this.state;
    const showNav = !isMobile || pathname == '/';
    const showContent = !isMobile || pathname != '/';

    return (
      <div className="app flex flex-grow">
        {showNav &&
          <Route path="/" component={Contacts} />
        }
        {showContent &&
          <Switch>
            <Route path="/chats/:contactId([0-9]+)" component={Messages} />
            <Route exact path="/" component={Greeting} />
            <Redirect to="/" />
          </Switch>
        }
      </div>
    );
  }
}
