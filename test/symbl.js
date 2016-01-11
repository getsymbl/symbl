var should = require('should');
var fs = require('fs');
var cjson = require('circular-json');
var symbl = require('../symbl.js');


describe('Baseline tests - Array', function() {
	
  describe('Baseline test - #indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      should.equal(-1, [1,2,3].indexOf(5));
      should.equal(-1, [1,2,3].indexOf(0));
    });
	it('should return index when the value is present', function () {
      should.equal(0, [1,2,3].indexOf(1));
      should.equal(1, [1,2,3].indexOf(2));
	  should.equal(2, [1,2,3].indexOf(3));
    });
  });
  
  describe('Unit tests', function() {
	 
	it('Identity test', function() {
		should.equal(symbl, symbl);
	});
  
  });
 
});