import React, { Component } from 'react';
import moment from 'moment';

import '../less/Greeting.less';

export default class Greeting extends Component {
  constructor(props) {
    super(props);

    this.getGreeting = this.getGreeting.bind(this);

    this.format = 'hh:mm:ss a';
    this.morningStart = '05:00:00 am';
    this.afternoonStart = '12:00:00 pm';
    this.eveningStart = '05:00:00 pm';
    this.greetings = [
      { time: this.morningStart, greeting: 'Morning' },
      { time: this.afternoonStart, greeting: 'Afternoon' },
      { time: this.eveningStart, greeting: 'Evening' }
    ];
  }

  getGreeting() {
    const currentTime = moment().date(1);

    for (let i = 0; i < this.greetings.length; i++) {
      const startTime = moment(this.greetings[i].time, this.format).date(1);
      const compareIndex = i == this.greetings.length - 1 ? 0 : i + 1;
      // Going from night to next morning
      const nextDay = !compareIndex ? 2 : 1;
      const endTime = moment(this.greetings[compareIndex].time, this.format).date(nextDay);

      if (currentTime.isBetween(startTime, endTime)) {
        return this.greetings[i].greeting;
      }
    }
  }

  render() {
    const greeting = this.getGreeting();
    return (
      <div className="greeting h3 text-muted flex flex-grow flex-column">
        Good {greeting}!
      </div>
    );
  }
}
