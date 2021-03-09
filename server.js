'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
var os = require('os');

// App
const app = express();
app.get('/', (req, res) => {
  res.send('This is Prod');
  os.platform();
  os.release();
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
