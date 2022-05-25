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

Create Empty Database

```bash
npm run db
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

### DSA keys

DSA key generation involves two steps:

    openssl dsaparam -out dsaparam.pem 3072
    openssl gendsa -out dsaprivkey.pem dsaparam.pem
    openssl dsa -in dsaprivkey.pem -pubout -out dsapubkey.pem
---

# Development

Install dev dependencies

```bash
npm install -g sass
```

Create Empty Database

```bash
npm run db
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
Encrypt messages before sending with this structure:
  - Symmetric Key
  - IV
  - SHA256(Symmetric Key || IV)

Symmetric Key Encryption
    - 256-bit keys
    - CBC Mode
    - use Crypto-JS 4.1.1 library for AES - https://www.npmjs.com/package/crypto-js


## Key Distribution
- Server encrypts the symmetric key in this structure with the users public RSA key:
  - Symmetric Key
  - IV
  - Digital Signature of (Symmetic Key || IV) using either RSA or DSA

 Uses the node-rsa library, https://www.npmjs.com/package/node-rsa - `npm install node-rsa` and https://www.npmjs.com/package/jsrsasign
`npm install jsrsasign jsrsasign-util` for DSA.

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

# TODO

## Front-end

Better design
  -  /chat and /chat/{room} could be fleshed out more

Store symmetrical key for chats in local storage

- When entering a room, ask the user to confirm

## Back-end

- Permanently store messages in DB

- Endpoint for fetching previous chat messages (maybe just add to room get)

- Add DELETE endpoint for deleting a chatroom

- consider using JWT that can use either RSA or DSA for digital signatures.
  - Does JWT meet the requirement of E(PUa, E(PRs, SymmetricKey)) that supplies the symmetric
    key with confidentiality and digital signature of the Server? Only digital signature
      - jsonwebtoken - https://github.com/auth0/node-jsonwebtoken

- How does the user know the Public Key of the Server?
  - currently, the server sends the public key after register/login
  - Should we have a handshake instead?
