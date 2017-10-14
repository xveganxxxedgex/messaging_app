import axios from 'axios';
const API_ROOT = 'http://localhost:8081/api';

export function isUnsuccessfulRequest(resp) {
  return !resp.status || resp.status < 200 || resp.status > 204;
}

export function handleUnsuccessfulRequest(resp) {
  if (isUnsuccessfulRequest(resp)) {
    const throwError = resp.statusText;
    throw new Error(throwError);
  }
}

export function getContacts() {
  return axios.get(`${API_ROOT}/contacts`);
}

export function getMessages(contactId) {
  return axios.get(`${API_ROOT}/messages`, { params: { id: contactId } });
}

export function sendMessage(contactId) {
  return axios.post(`${API_ROOT}/message-send`, { params: { id: contactId } });
}
