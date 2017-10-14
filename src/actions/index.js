import * as api from './api';
import { setCursorData, setCursorError } from './utility';

import tree from '../state';

const messageBodies = [
  [
    'When are you coming home?',
    'Are we getting ice cream tonight?',
    'Ice cream and scary movies?',
    'Okay fine, video games instead',
    'Scary video games? :D',
    'Definitey ice cream either way though'
  ],
  [
    'Sorry, I couldn\'t go to the meeting the other day, let\'s try to reschedule'
  ],
  [
    'Have you heard from Nicole?',
    'I can\'t seem to get her to answer her phone'
  ],
  [],
  [
    'Hey do you remember me?',
    'Do you still talk to Tifa?',
    'There\'s... Something you should know about Aeris...'
  ],
  [
    '...',
    '...Whatever'
  ]
];

export function getContacts() {
  const cursor = tree.select('contacts');
  const data = [];

  const contactNames = [
    'Leon Kennedy',
    'Marcus Fenix',
    'Isaac Clarke',
    'Chris Redfield',
    'Cloud Strife',
    'Squall Leonhart'
  ];

  for (let i = 0; i < contactNames.length; i++) {
    data.push({ name: contactNames[i], id: i, total: messageBodies[i].length })
  }

  cursor.merge({ data });
  return;

  // Reset while we load new data
  cursor.merge({
    loading: true,
    data: null,
    error: null
  });

  api.getContacts()
    .then(resp => {
      api.handleUnsuccessfulRequest(resp);
      return resp.data;
    })
    .then(data => {
      setCursorData(cursor, data);
    })
    .catch(err => {
      setCursorError(cursor, err);
    });
}

export function getMessages(contactId) {
  const cursor = tree.select('messages');
  const data = [];

  for (let i = 0; i < messageBodies[contactId].length; i++) {
    data.push({
      text: messageBodies[contactId][i],
      id: i,
      date: new Date(2017, 9, 13, 14, 10 + i),
      sender_user: contactId
    });
  }

  cursor.merge({ data });
  return;

  // Reset while we load new data
  cursor.merge({
    loading: true,
    data: null,
    error: null
  });

  api.getMessages(contactId)
    .then(resp => {
      api.handleUnsuccessfulRequest(resp);
      return resp.data;
    })
    .then(data => {
      setCursorData(cursor, data);
    })
    .catch(err => {
      setCursorError(cursor, err);
    });
}

export function sendMessage(contactId, message) {
  const cursor = tree.select(['messages', 'data']);
  const user = tree.get(['user', 'data']);

  cursor.push({
    text: message,
    id: cursor.get().length,
    date: new Date(),
    sender_user: user.id
  });
  return;

  api.sendMessage(contactId)
    .then(resp => {
      api.handleUnsuccessfulRequest(resp);
      return resp.data;
    })
    .then()
    .catch(err => {
      setCursorError(cursor, err);
    });
}
