'use strict';
const express = require('express');
var app = express();

app.set('port', process.env.PORT || 3001);
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`listening on ${app.get('port')}`);
});

app.get('/api/potato', (request, response) => {
  // const url = request.query.url;
  response.send('potato');
});
