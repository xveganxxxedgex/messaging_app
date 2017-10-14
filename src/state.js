import Baobab from 'baobab';

const state = new Baobab({
  // The logged in user info
  user: {
    loading: false,
    data: {
      name: 'Authenticated User',
      id: 10
    },
    error: null
  },
  // List of contacts for the logged user
  contacts: {
    loading: false,
    data: null,
    error: null
  },
  // Chat history between logged user and a given contact
  messages: {
    loading: false,
    data: null,
    error: null
  }
});

export default state;
