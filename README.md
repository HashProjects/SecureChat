# SecureChat

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
npm run dev
```

# Documentation

## HTTP Endpoints

### POST `/register`

**request**
```json
{
  username: string
  password: string
}
```
**response**
```json
{
  authToken: string
}
```
---

### POST `/login`

**request**
```json
{
  username: string
  password: string
}
```
**response**
```json
{
  authToken: string
}
```
---

## Web Socket Endpoints

### `connection`
---

### `disconnect`
---

### `message`
```json
{
  conversation: string,
  isImage: bool,
  msg: string,
  checksum: string
}
```
---
