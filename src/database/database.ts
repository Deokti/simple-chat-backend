export const ROOT = "MAIN";
export const STATE_VALUE = {
  users: "users",
  messages: "messages"
}

export const STATE = new Map([
  [STATE_VALUE.users, []],
  [STATE_VALUE.messages, []],
]);

export const getUsers = () => {
  return STATE.get(STATE_VALUE.users);
}

export const getMessages = () => {
  return STATE.get(STATE_VALUE.messages);
}

export const updateUsers = (user) => {
  return getUsers().push(user);
}

export const updateMessages = (message) => {
  return getMessages().push(message);
}

export const removeAllMessages = () => {
  getMessages().splice(0, getMessages().length);
}

export const findIndexUser = (field: string, id: string) => {
  return getUsers().findIndex((s) => s[field] === id)
}

export const removeUser = (id: string) => {
  const index = findIndexUser("socketId", id);
  getUsers().splice(index, 1);
}

