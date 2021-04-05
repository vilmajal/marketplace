const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const express = require('express');
const helmet = require('helmet');

const app = express(); // Creates express app
//const http = require('http');
const https = require('https');
const fs = require('fs');

// const httpsServer = https.Server(app);
// const io = require('socket.io')(httpsServer, {
//   cors: {
//     origin: "http://localhost:8081",
//   }
// });

// Start server
const server = https.createServer({
  key: fs.readFileSync('./security/server.key'),
  cert: fs.readFileSync('./security/server.cert'),
}, app);

const io = require('socket.io')(server, {
  cors: {
    origin: "https://localhost:8081",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const model = require('./model.js');

console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8081; // The port that the server will listen to

model.init({ io });
app.use(express.json()); /*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.urlencoded({ extended: true }));

// Setup session
const session = expressSession({
  name: 'cookieDough',
  secret: 'Super secret! Shh! Do not tell anyone...',
  resave: true,
  saveUninitialized: false, // Ingen kaka automatiskt från start
  cookie: {
    secure: false,
  },
});

app.use(session);

//app.use(helmet());

// Serve client
app.use(express.static(publicPath));/*
express.static(absolutePathToPublicDirectory)
This will serve static files from the public directory, starting with index.html
*/

// Bind REST controllers to /api/*
const auth = require('./controllers/auth.controller.js');
const norm = require('./controllers/norm.controller.js');

// Att den här kommer före den där nere är tydligen fett viktigt
app.use('/api', norm.router);
// All chat endpoints require the user to be authenticated
app.use('/api', norm.reqAuth, auth.router);

server.listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});

/* // Start server
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}); */
