/* globals describe, beforeEach, afterEach, it */

const assert = require('assert');
const request = require('supertest');
const app = require('../server');

describe('GET /api/urls', () => {

  beforeEach(() => {
    app.locals.urls = [{
      shortID: "rkc3bAsGe",
      createdAt: 1480479154462,
      longUrl: "http://google.com",
      count: 0
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

describe('GET /api/:shortid', () => {

  beforeEach(() => {
    this.url = {
      shortID: "rkc3bAsGe",
      createdAt: 1480479154462,
      longUrl: "http://google.com",
      count: 0,
      title: "Google"
    };
    app.locals.urls = [this.url];
  });

  afterEach(() => {
    app.locals.urls = [];
  });

  it('should return a url with the provided short id', (done) => {

    request(app)
      .get(`/api/${this.url.shortID}`)
      .expect(301, done);
  });
});

describe('POST /api/post', () => {

  beforeEach(() => {
    app.locals.urls = [];
  });

  it('should create a new url in the list', (done) => {
    const url = {
      longUrl: "http://google.com",
      count: 0
    };

    request(app)
      .post('/api/post')
      .send({url: url.longUrl})
      .expect(201)
      .end(() => {
        assert.equal(app.locals.urls[0].count, 0);
        assert.equal(app.locals.urls[0].longUrl, "http://google.com");
        done();
      });
  });

  it('should return a 422 if the request is missing a url', (done) => {
    const url = { longUrl: null };

    request(app)
      .post('/api/post')
      .send({ url: url.longUrl })
      .expect(422, done);
  });
});
