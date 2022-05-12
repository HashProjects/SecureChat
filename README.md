# SecureChat

- [Installation](#installation)
- [Development](#development)
- [Contribution](#contribution)
- [Documentation](#documentation)

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

Install dev dependencies

```bash
npm install -g sass
```

Start the dev web server

```bash
npm start
```

# Contribution

To contribute to this repository, create a fork.
Push your changes to your fork, then on the forked repo, click "contribute" to create a pull request with your changes on the main repo.

Please use detailed commits and exclude unnessary files and changes unrelated to your pull. 

Do not `git add .` please add a commit message for each group of changes, and leave a description of your change in the pull request.

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
