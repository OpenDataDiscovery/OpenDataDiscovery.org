var request = require('supertest');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var params = require('../config/params.js');

describe('API - /info/instance', function() {
  it('It should return an array of instance information', function(done) {
    request('localhost:' + params.port)
      .get('/api/info/instance')
      .end(function(err, res) {
        if (err) {
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.exist;
          return;
        }

        expect(res.body.success).to.be.true;
        expect(res.body.instances).to.have.length.above(0);
        done();
      });
  });
});
