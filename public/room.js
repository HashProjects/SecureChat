// **********
// Helpers
// **********

const createMessageElement = (name, msg) => {
  let item = document.createElement("li");
  item.innerText = `${name}: ${msg}`;
  item.classList.add("message");
  $("#messageList").append(item);
};

const createUserElement = (user) => {
  let item = document.createElement("li");
  item.innerText = user.name;
  item.classList.add("user");
  item.classList.add("status");
  item.id = user.id;
  $("#userList").append(item);
};

// **********
// API
// **********

$("#chatButton").click(() => {
  const text = $("#chatBox").val();
  socket.send(text);
});

$.ajax({
  type: "POST",
  url: "/api/roomusers",
  contentType: "application/json",
  dataType: "json",
  data: JSON.stringify({
    room: window.location.pathname.split("/").pop(),
  }),
  success: (data) => {
    const myId = localStorage.getItem("userId");
    data.users.forEach((user) => {
      if (user.id != myId) {
        createUserElement(user);
      }
    });
  },
});

// **********
// Sockets
// **********

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
 * A message from another user
 */
socket.on("message", (username, msg) => {
  console.log("message", username, msg)
  createMessageElement(username, msg);
});

/**
 * A list of users currently online
 */
socket.on("usersOnline", (users) => {
  console.log("Online users: ", users);
  users.forEach((user) => {
    // createUserElement(user);
  });
});

/**
 * A logged in user connected
 */
socket.on("userConnect", (user) => {
  console.log("userConnect", user);
  $(`#${user.id}`).addClass("online");
});

/**
 * A logged in user disconnected
 */
socket.on("userDisconnect", (user) => {
  console.log("userDisconnect", user);
  $(`#${user.id}`).removeClass("online");
});
