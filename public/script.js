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
socket.on("online", (...data) => {
  const users = data[0];
  let list = document.getElementById("userList");
  let item;
  for(let user of users) {
    item = document.createElement("li");
    item.innerText = user.username;
    list.appendChild(item)
  }
});
