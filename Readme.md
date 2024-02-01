# Node Boiler Plate

## Features
- User Registeration
- User Login with JWT
- CRUD Operation Avaliable on all Fields
- Upload and Update Profile Photo
- Forget Password
- Handlebars View 

### Pre-requisites

- Install mongoDB `https://www.mongodb.com/try/download/community`

- Install npm and nodeJs `https://nodejs.org/`

$ node --versionPlease update your project in below sheet asap
- Must be `npm version >= 6.x`

$ npm --version
- Must be `npm version >= 12.x`

## ----Front-end server----
This project was generated with [Express-Handlebars](https://github.com/express-handlebars/express-handlebars) version 6.0.6

- Install required dependencies
$ npm install express-handlebars
$ npm install

## ----Back-end server----

### Run Node Server


$ cd node

- Install required dependencies
$ npm install

- Start server
$ npm run dev

--Please set .env file before starting the server
DatabaseUrl="mongodb://localhost:27017/UserDatabase"
NODE_ENV="local"
NODE_PORT_ENV=""
PASSWORD="bciiwbfwctogrgih"
FROM="aman.elsner@gmail.com"

### File Structure

```
|-- app.js
|-- config
|   `-- index.js
|-- controller
|   `-- usercont
|       `-- index.js
|-- helper
|   `-- bcrypt.js
|-- images
|   `-- profileImage
|       `-- profileimg-1656587499503.png
|-- model
|   `-- userschema.js
|-- package-lock.json
|-- package.json
|-- routes
|   `-- index.js
|-- services
|-- views
|   |-- edit.hbs
|   |-- layouts
|   |   `-- main.hbs
|   |-- login.hbs
|   |-- message.hbs
|   |-- partials
|   |   |-- footer.hbs
|   |   `-- header.hbs
|   |-- sendemail.hbs
|   |-- setforgetpassword.hbs
|   |-- signup.hbs
|   `-- usersdata.hbs
`-- yarn.lock
