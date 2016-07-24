var request = require('supertest');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var params = require('../config/params.js');

describe('API - /api/instances', function() {
  it('It should return an array of instance information', function(done) {
    request('localhost:' + params.port.development)
      .get('/api/instances')
      .end(function(err, res) {
        if (err) {
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.exist;
          done();
          return;
        }

        expect(res.body.success).to.be.true;
        expect(res.body.instances.length).to.be.above(0);
        done();
      });
  });
});

describe('API - /api/region_levels', function() {
  it('It should return an array of region levels', function(done) {
    request('localhost:' + params.port.development)
      .get('/api/region_levels')
      .end(function(err, res) {
        if (err) {
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.exist;
          done();
          return;
        }

        expect(res.body.success).to.be.true;
        expect(res.body.levels).to.have.lengthOf(5);
        done();
      });
  });
});

describe('API - /api/map_styles', function() {
  it('It should return an array of 5-level map colors', function(done) {
    request('localhost:' + params.port.development)
      .post('/api/map_styles')
      .send({ class: 5 })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.exist;
          done();
          return;
        }

        expect(res.body.success).to.be.true;
        expect(res.body.styles).to.have.lengthOf(5);
        done();
      });
  });
});
