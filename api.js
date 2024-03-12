// const routesChats = require('./routes/chat');

const bp = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const routesAuth = require('./routes/auth');
const routesflw = require('./routes/flw');











const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + path.basename(file.originalname));
    }
});

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const app = express();
app.use(bp.json());
app.use(multer({ storage: fileStorage , fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});


// app.use( '/chat' , routesChats);
app.use( '/auth' , routesAuth);
app.use(  routesflw);
app.use(cors());

mongoose
.connect('mongodb://localhost:27017/?directConnection=true')
.then(result => {
    const server = app.listen(8080);
    const socketIO = require('./socket').init(server , {
      cors: {
        origin: '*',
      }
    });
    socketIO.on('connection' , socket => {
      console.log('client connected');
    });
})
.catch(err => {
    console.log(err);
})
