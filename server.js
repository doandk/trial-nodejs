'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var os = require('os');
os.platform(); // 'darwin'
os.release(); //'10.8.0'

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
  res.send('Xendit - Trial - Doan Sinaga - 09-03-2021 - <current_date>
');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
