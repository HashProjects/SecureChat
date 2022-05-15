# SecureChat

- [Installation](#installation)
- [Development](#development)
- [Contribution](#contribution)
- [Cryptography](#cryptography)
- [Documentation](#documentation)
- [TODO](#todo)

# Installation

Install node.js

```bash
sudo apt-get install -y nodejs
```

or download from https://nodejs.org/en/download/

Install dependencies

```bash
npm install
```

Start the web server

```bash
npm run prod
```

## Key Generation

Only use the default keys for development.

If you are moving to production:

Use `ssh-keygen` to generate a private key:
`ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`
(Do not enter a passphrase!)

And a public key:
`openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`

Update the `.env` to use the new file names.
In this example the private key was jwt.RS256.key and the public key was jwt.RS256.key.pub

---

# Development

Install dev dependencies

```bash
npm install -g sass
```

Start the dev web server

```bash
npm start
```

---

# Contribution

To contribute to this repository, create a fork.
Push your changes to your fork, then on the forked repo, click "contribute" to create a pull request with your changes on the main repo.

Please use detailed commits and exclude unnessary files and changes unrelated to your pull.

Do not `git add .` please add a commit message for each group of changes, and leave a description of your change in the pull request.

---

# Cryptography

## Registration and Login

`bcrypt` is used for user password hashing and salting.

No plaintext passwords are stored.

When the user attempts to login, their password is hashed and compared against the stored hash.

## Authentication

`JSON Web Tokens` are used as authentication tokens.

JWTs contain a digital signature that guarantees integrity.

## Message Sending

## Key Passing

# Documentation

## HTTP Endpoints

### POST `/register`

**request**

```
{
  username: string
  password: string
}
```

**response**

```
{
  authToken: string
}
```

---

### POST `/login`

**request**

```
{
  username: string
  password: string
}
```

**response**

```
{
  authToken: string
}
```

---

## Web Socket Endpoints

### `connection`

```
{
  auth: {
    token: string,
  }
}
```

---

### `disconnect`

---

### `message`

```
{
  conversation: string,
  isImage: bool,
  msg: string,
  checksum: string
}
```

---

# TODO

## Front-end

- Better rendering of online users (wait till more work on sockets are finished)
- Interface for a chat room (Message box, previous messages, users in room)

## Back-end

- Add socket rooms for chat rooms
- Add `Message` table to DB
  - `id PRIMARY`
  - `text`
  - `room_id`
  - `timestamp`
  - `user_id`
- Add `ChatRoom` table to DB
  - `id PRIMARY`
  - `key`
- Add `UserRooms` table to DB
  - `user_id`
  - `room_id`
- Distribute keys to users in the room
- Encrypt messages in rooms using the keys
- Add POST endpoint for creating a chatroom
  > **request**
  >
  > ```
  > {
  >  creator_id: string,
  >  user_ids: string[]
  > }
  > ```
  >
  > **response**
  >
  > ```
  > {
  >  group_id: string
  > }
  > ```
- Add DELETE endpoint for deleting a chatroom
