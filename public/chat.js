// *********
// DOM References
// *********

const onlineUserList = document.getElementById("userList");

// **********
// Helpers
// **********

const createUserElement = (user) => {
  let item = document.createElement("li");
  item.innerText = user.name;
  item.id = user.id;
  onlineUserList.appendChild(item);
};

const deleteUserElement = (user) => {
  let userElement = document.getElementById(user.id);
  onlineUserList.removeChild(userElement);
};

//https://www.w3schools.com/js/js_cookies.asp
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

// *********
// API Calls
// *********

const logout = () => {
  $.ajax({
    type: "POST",
    url: "/api/logout",
  });
};

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
socket.on("usersOnline", (users) => {
  console.log("Online users: ", users);
  users.forEach((user) => {
    createUserElement(user);
  });
});

/**
 * A logged in user connected
 */
socket.on("userConnect", (user) => {
  console.log("userConnect", user);
  createUserElement(user);
});

/**
 * A logged in user disconnected
 */
socket.on("userDisconnect", (user) => {
  console.log("userDisconnect", user);
  deleteUserElement(user);
});
