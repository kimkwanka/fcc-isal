/* global describe it expect */

const expect = require('chai').expect;

describe('Server', () => {
  it('should exist', () => (
    expect(require('./server.js')).to.be.defined  // eslint-disable-line global-require
  ));
});
