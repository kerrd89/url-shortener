'use strict';
const express = require('express');
const bodyParser = require('body-parser');
var app = express();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`listening on ${app.get('port')}`);
});

app.get('/api/potato', (request, response) => {
  // const url = request.query.url;
  response.send('potato');
});

app.post('/api/post', (request, response) => {
  const { url } = request.body;
  if(!request) {
    return response.status(422).send({
      error: "No URL was provided"
    });
  }
  response.status(201).json({ url: url });
});
