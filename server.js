'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const shortID = require('shortid');
var app = express();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static('public'));
app.locals.urls = {};

app.listen(app.get('port'), () => {
  console.log(`listening on ${app.get('port')}`);
});

app.get('/api/urls', (request, response) => {
  response.send({ urls: app.locals.urls });
});

app.get('/api/:shortid', (request, response) => {
  let { shortid } = request.params;
  let longUrl = app.locals.urls[shortid];

  if(!longUrl) return response.status(404);

  response.redirect(301, longUrl);
});

app.post('/api/post', (request, response) => {
  let { url } = request.body;

  let id = shortID();

  if(!request) {
    return response.status(422).send({
      error: "No URL was provided"
    });
  }

  app.locals.urls[id] = url;
  response.status(201).json(id);
});
