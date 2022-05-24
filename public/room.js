// **********
// Globals
// **********

var room;
// current set key and iv to a default value
// TODO: get these values from the server
var symmetricKey;
var initializationVector;

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
  return CryptoJS.AES.encrypt(msg, symmetricKey, { iv: initializationVector, mode: CryptoJS.mode.CBC }).toString();
}

// decrypt with AES-256-CBC
const decryptMessage = (msg) => {
  return CryptoJS.AES.decrypt(msg, symmetricKey, {iv : initializationVector, mode: CryptoJS.mode.CBC}).toString(CryptoJS.enc.Utf8);
}

// **********
// API
// **********

function sendMessage() {
  const text = $("#chatBox").val();
  msg = encryptMessage(text)
  console.log("-> CHAT MESSAGE: plaintext = " + text + " => cipherText: " + msg + " with key: " + symmetricKey + " and iv:" + initializationVector);
  socket.send(msg);
  $("#chatBox").val('')
}

$("#chatButton").click(() => {
  sendMessage()
});

$("#chatBox").on('keyup', function(event) {
  try {
    if (event.keyCode === 13) {
      sendMessage();
    }
    false;
  } catch (e) { };
  return true
})

const room_id = window.location.pathname.split("/").pop();
$.ajax({
  type: "GET",
  url: `/api/room/${room_id}`,
  dataType: "json",
  success: (data) => {
    const myId = localStorage.getItem("userId");
    $("#logout").text("Logout " + localStorage.getItem("username"));
    room = data.room;
    room.users.forEach((user) => {
      if (user.id !== myId) {
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
    console.log("encryptedKey = " + data.encryptedKey)

    const key = localStorage.getItem("rsaKeyPrivate");
    console.log(key);

    const keyPublic = localStorage.getItem("rsaKeyPublic");
    console.log(keyPublic);

    const keyPrivate = new NodeRSA();
    keyPrivate.importKey(key);

    const pt = keyPrivate.decrypt(data.encryptedKey, 'hex')
    // first 64 characters are the symmetric key
    symmetricKey = CryptoJS.enc.Hex.parse(pt.slice(0, 64));
    // then  32 characters of IV
    initializationVector = CryptoJS.enc.Hex.parse(pt.slice(64, 96));

    // this is what is signed
    const concat = symmetricKey + initializationVector;

    // then digital signature
    const signature = pt.slice(96);
    console.log("signature: " + signature);

    const keyServerPublic = new NodeRSA();
    const serverPublicKey = localStorage.getItem("serverPublicKey");
    const signatureType = localStorage.getItem("signatureType");
    var verified = false;
    if (signatureType === 'rsa') {
      console.log("server-public-key:--------------\n" + serverPublicKey);
      keyServerPublic.importKey(serverPublicKey, 'public');
      verified = keyServerPublic.verify(concat, signature, 'hex', 'hex')
    } else {
      const sig2 = new KJUR.crypto.Signature({alg: 'SHA256withDSA'});
      sig2.init(serverPublicKey);
      sig2.updateString(concat);
      verified = sig2.verify(signature);
    }

    console.log(pt)
    console.log("after decryption:----------------------");
    console.log("symmetricKey = " + symmetricKey);
    console.log("iv           = " + initializationVector);
    console.log(signatureType + " verified = " + verified);
    if (verified && symmetricKey.length !== 0 && initializationVector.length !== 0) {
      $("#roomTitle").text("Secure Chat Room")
    } else {
      $("#roomTitle").text("Insecure Chat Room")
    }
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
  if (msg.length === 0 || text.length === 0) {
    console.log("<- CHAT MESSAGE corrupted")
    createMessageElement(username, "<<INVALID SYMMETRIC KEY>>")
  } else {
    console.log("<- CHAT MESSAGE: text = " + text + " <= cipherText: " + msg + " with key: " + symmetricKey + " and iv:" + initializationVector);
    createMessageElement(username, text);
  }
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