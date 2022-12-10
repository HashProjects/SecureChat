// **********
// Globals
// **********

var rooms = [];
var users = [];

// **********
// Helpers
// **********

const defaultRoomName = (users) => {
  let name = "";
  // sort the user's names
  const sortedUsers = users.sort((u1,u2) => {
    if (u1 > u2) {
      return 1;
    }

    if (u1 < u2) {
      return -1;
    }
    return 0;
  });

  sortedUsers.forEach( u =>  name += u + ", ");
  return name.slice(0, -2);
}

const createUserElement = (user) => {
  if(users.find(u => u.id === user.id))
      return;

  users.push(user);
  let item = document.createElement("li");
  item.innerText = user.name;
  item.classList.add("user");
  item.id = user.id;
  $("#userList").append(item);
  $(`#${user.id}`).click((e) => {
    // determine if the room exists
    const roomName = defaultRoomName([localStorage.getItem("username"), e.target.innerText])
    if(rooms.find(r => r.name === roomName))
      return;

    $.ajax({
      type: "POST",
      url: "/api/createRoom",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        users: [{
            id: localStorage.getItem("userId"),
            name: localStorage.getItem("username"),
          },
          {
            id: e.target.id,
            name: e.target.innerText,
          },
        ],
      }),
      success: (data) => {
        createChatElement(data.room);
      },
    });
  });
};

const createChatElement = (room) => {
  if(rooms.find(u => u.id === rooms.id))
    return;
  rooms.push(room);
  let item = document.createElement("li");
  item.innerText = room.name;
  item.classList.add("chatRoom");
  item.id = room.id;
  $("#chatList").append(item);
  $(`#${room.id}`).click((e) => {
    window.location = `/chat/${room.id}`;
  });
};

const deleteUserElement = (user) => {
  let userElement = document.getElementById(user.id);
  $("#userList").removeChild(userElement);
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
// Local Storage
// *********

// *********
// API Calls
// *********

$.ajax({
  type: "GET",
  url: `/api/user/${localStorage.getItem("userId")}`,
  success: (data) => {
    $("#logout").text("Logout " + localStorage.getItem("username"));
    data.rooms.forEach((room) => {
      //console.log(room.name);
      createChatElement(room);
    });
  },
});

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