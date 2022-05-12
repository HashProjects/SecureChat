// *********
// DOM References
// *********

let onlineUserList = document.getElementById("userList");

// *********
// Sockets
// *********

/**
 * The Socket.io instance
 */
let socket = io();

/**
 * Initial connection
 */
socket.on("connect", () => {});

/**
 * Successful Reconnect
 */
socket.on("reconnect", (attempt) => {});

/**
 * Attempting to reconnect
 * @argument {number} attempt - number of reconnection attempts
 */
socket.on("reconnect_attempt", (attempt) => {});

/**
 * Failed to reconnect
 */
socket.on("reconnect_failed", () => {});

/**
 * Any error
 */
socket.on("error", (error) => {});

/**
 * A list of users currently online
 */
socket.on("usersOnline", (...data) => {
  const users = data[0];
  users.forEach((user) => {
    createUserElement(user);
  });
});

/**
 * A logged in user connected
 */
socket.on("userConnect", (...data) => {
  const user = data[0];
  createUserElement(user);
});

/**
 * A logged in user disconnected
 */
socket.on("userConnect", (...data) => {
  const user = data[0];
  deleteUserElement(user);
});

// **********
// Helpers
// **********

const createUserElement = (user) => {
  let item = document.createElement("li");
  item.innerText = user.username;
  item.id = user.id;
  onlineUserList.appendChild(item);
};

const deleteUserElement = (user) => {
  let userElement = document.getElementById(user.id);
  onlineUserList.removeChild(userElement);
};
