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
	 
	it('should have tautology', function() {
		should.equal(symbl, symbl);
	});
	
	it('should have functional synchronous repository', function() {
		var testUuid = symbl.bootstrap.generateUuid();
		symbl.repository.setItemSync(testUuid,'the answer to life, the universe, and everything.');
		should.equal('the answer to life, the universe, and everything.', symbl.repository.getItemSync(testUuid));
		symbl.repository.removeItemSync(testUuid);
		should.equal(symbl.repository.getItemSync(testUuid), undefined);
	});
	
	it('should have minimal self definition', function() {
				
		should.equal(typeof symbl.ai, 'object');
		should.equal(typeof symbl.api, 'function');
		should.equal(typeof symbl.bootstrap, 'object');
		
	});
	
	it('should have working bootstrap hash function', function() {
		
		symbl.bootstrap.hash.update('The quick brown fox jumps over the lazy dog');
		should.equal(symbl.bootstrap.hash.digest().toHex(), "07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6");
		
	});
	
	it('should have non-empty string bootstrap salt', function() {
		
		should.notEqual(symbl.bootstrap.salt.length, 0);
		
	});
	
	it('should have functional REST service', function() {
		
	});
	
	it('should have functional symbl.graph.test', function() {
		
		
	});
	
	it('should copy symbl.graph', function() {
		
		should.notEqual(symbl.graph.copy(symbl.graph), symbl.graph);
		
	});
  
  });
 
});