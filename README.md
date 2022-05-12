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
npm run prod
```

# Development

Install deve dependencies

```bash
npm install -g sass
```

Start the dev web server

```bash
npm start
```

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
