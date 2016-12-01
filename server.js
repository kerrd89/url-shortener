'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const shortID = require('shortid');
const axios = require('axios');
var app = express();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static('public'));
app.locals.urls = [];

const getTitle = (url) => {
    axios.get(`http://textance.herokuapp.com/title/www.${url.slice(7)}`)
    .then((response) => {
      app.locals.urls[app.locals.urls.length-1].title = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

app.get('/api/urls', (request, response) => {
  response.send({ urls: app.locals.urls });
});

app.get('/api/:shortid', (request, response) => {
  let { shortid } = request.params;

  let longUrl = app.locals.urls.map((url, i) => {
    if(url.shortID === shortid) {
      app.locals.urls[i].count++;
      response.redirect(301, url.longUrl);
    }
  });

  if(!longUrl) return response.status(404);

});

app.post('/api/post', (request, response) => {
  let { url } = request.body;
  let obj = {};
  obj.shortID = shortID();
  obj.createdAt = Date.now();
  obj.longUrl = url;
  obj.count = 0;
  obj.title = getTitle(url);

  if(!request) {
    return response.status(422).send({
      error: "No URL was provided"
    });
  }

  app.locals.urls.push(obj);
  response.status(201).json(obj.shortID);
});

// for testing to work
if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`listening on ${app.get('port')}`);
  });
}

module.exports = app;
