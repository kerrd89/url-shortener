'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const shortID = require('shortid');
var app = express();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static('public'));
app.locals.urls = [];


app.get('/api/urls', (request, response) => {
  response.send({ urls: app.locals.urls });
});

app.get('/api/:shortid', (request, response) => {
  let { shortid } = request.params;
  let longUrl = app.locals.urls.map((url) => {
    if(url.shortID === shortid) return url.longUrl;
  });

  if(!longUrl) return response.status(404);

  response.redirect(301, longUrl);
});

app.post('/api/post', (request, response) => {
  let { url } = request.body;
  let obj = {};
  obj.shortID = shortID();
  obj.createdAt = Date.now();
  obj.longUrl = url.longUrl;
  obj.count = 0;

  if(!request.body.url.longUrl) {
    return response.status(422).send({
      error: "No URL was provided"
    });
  }

  app.locals.urls.push(obj);
  response.status(201).json(id);
});

// for testing to work
if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`listening on ${app.get('port')}`);
  });
}

module.exports = app;
