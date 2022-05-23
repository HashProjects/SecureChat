// **********
// Globals
// **********

var room;
// current set key and iv to a default value
// TODO: get these values from the server
var symmetricKey = "e8f61f6bc3f8d36ea8828b62f574f9d767842572d677e34a7d618d5f7ea219ba";
var initializationVector = "3472cd3b0041c4d9ce2283ff2dd2ed5c"

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

// encrypt with AES-256-CBC
const encryptMessage = (msg) => {
  return CryptoJS.AES.encrypt(msg, symmetricKey, {iv : initializationVector}).toString();
}

// decrypt with AES-256-CBC
const decryptMessage = (msg) => {
  return CryptoJS.AES.decrypt(msg, symmetricKey, {iv : initializationVector}).toString(CryptoJS.enc.Utf8);
}

// **********
// API
// **********

$("#chatButton").click(() => {
  const text = $("#chatBox").val();
  msg = encryptMessage(text)
  console.log("-> CHAT MESSAGE: plaintext = " + text + " => cipherText: " + msg + " with key: " + symmetricKey + " and iv:" + initializationVector);
  socket.send(msg);
});

const room_id = window.location.pathname.split("/").pop();
$.ajax({
  type: "GET",
  url: `/api/room/${room_id}`,
  dataType: "json",
  success: (data) => {
    const myId = localStorage.getItem("userId");
    room = data.room;
    room.users.forEach((user) => {
      if (user.id != myId) {
        createUserElement(user);
      }
    });
  },
});

$.ajax({
  url: `/api/key`,
  dataType: "json",
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify({
    user_id: localStorage.getItem("userId"),
    room_id: room_id,
  }),
  success: (data) => {
    console.log("got the key")
    //const myId = localStorage.getItem("userId");
    symmetricKey = data.key;
    initializationVector = data.iv;
    // TODO: remove logging of keys and also data.key and data.iv
    console.log("symmetricKey = " + symmetricKey);
    console.log("iv           = " + initializationVector);
    console.log("encryptedKey = " + data.encryptedKey)

    const key = localStorage.getItem("rsaKeyPrivate");
    console.log(key);

    const keyPublic = localStorage.getItem("rsaKeyPublic");
    console.log(keyPublic);

    //var encrypt = new JSEncrypt();
    const keyPrivate = new NodeRSA();
    keyPrivate.importKey(key);

    const pt = keyPrivate.decrypt(data.encryptedKey, 'hex')
    // first 64 characters are the symmetric key
    symmetricKey = pt.slice(0, 64);
    // then  32 characters of IV
    initializationVector = pt.slice(64, 96);

    // this is what is signed
    const concat = symmetricKey + initializationVector;

    // then digital signature
    const signature = pt.slice(96);
    console.log("signature: " + signature);

    const keyServerPublic = new NodeRSA();
    const serverPublicKey = localStorage.getItem("serverPublicKey");
    console.log("server-public-key:--------------\n" + serverPublicKey);
    keyServerPublic.importKey(serverPublicKey, 'public');
    const verified = keyServerPublic.verify(concat, signature, 'hex', 'hex')

    console.log(pt)
    console.log("after decryption:----------------------");
    console.log("symmetricKey = " + symmetricKey);
    console.log("iv           = " + initializationVector);
    console.log("verified = " + verified);
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
  console.log("message", username, msg);
  // decrypt the message
  text = decryptMessage(msg)
  console.log("<- CHAT MESSAGE: text = " + text + " <= cipherText: " + msg + " with key: " + symmetricKey + " and iv:" + initializationVector);
  createMessageElement(username, text);
});

/**
 * A list of users currently online
 */
socket.on("usersOnline", (users) => {
  console.log("Online users: ", users);
  users.forEach((u1) => {
    room.users.forEach((u2) => {
      if (u1.id == u2.id) {
        $(`#${u1.id}`).addClass("online");
      }
    })
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
