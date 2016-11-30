/* globals describe, beforeEach, afterEach, it */

// const assert = require('assert');
const supertest = require('supertest');
const request = supertest('localhost:3001');
// const request = require('supertest');
const app = require('../server');

describe('GET /api/urls', () => {

  beforeEach(() => {
    app.locals.urls = [{
      "shortID":"rkc3bAsGe","createdAt":1480479154462,"longUrl":"http://google.com","count":0
    }];
  });

  afterEach(() => {
    app.locals.urls = [];
  });

  it('should return all urls stored in app.locals.urls', (done) => {
    request(app)
      .get('/api/urls')
      .expect({ urls: app.locals.urls }, done);
  });

});
