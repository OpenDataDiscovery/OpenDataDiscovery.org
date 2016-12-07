const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rp = require('request-promise');

chai.use(chaiAsPromised);
const expect = chai.expect;

const params = require('../../config/params.js');

describe('API - /api/instances', function() {
  it('It should return an array of instance information', () => {
    return rp({
      method: 'GET',
      uri: `http://localhost:${params.port.production}/api/instances`,
      json: true
    })
    .then(body => {
      expect(body.success).to.be.true;
      expect(body.instances.length).to.be.above(0);
    });
  });
});

describe('API - /api/instances/summary', function() {
  it('It should return a summary of instances', () => {
    return rp({
      method: 'GET',
      uri: `http://localhost:${params.port.production}/api/instances/summary`,
      json: true
    })
    .then(body => {
      expect(body.success).to.be.true;
      expect(body.summary.count).to.be.above(0);
    });
  });
});


describe('API - /api/instance/:instanceID', function() {
  it('It should return instance data information', () => {
    return rp({
      method: 'GET',
      uri: `http://localhost:${params.port.production}/api/api/instance/1`,
      json: true
    })
    .then(body => {
      expect(body.success).to.be.true;
      expect(body.instance.tags).to.have.lengthOf(10);
      expect(body.instance.categories).to.have.lengthOf(10);
      expect(body.instance.organizations).to.have.lengthOf(10);
    });
  });
});
