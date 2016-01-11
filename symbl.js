/**
* Symbl.io AI as a Service Platform
* MIT License
* https://symbl.io
* https://github.com/getsymbl/symbl
*/

/**
* System constants
*/

const aws			= require('aws-sdk');
const benchmark		= require('benchmark');
const cryptography	= require('node-forge');
const express		= require('express');
const forge			= require('forge');
const cjson			= require('circular-json');
const http 			= require('http');
const https 		= require('https');
const platform		= require('platform');
const should		= require('should');
const storage 		= require('node-persist');

/**
* Initialize symbl repository
*/
var symbls = storage.init( {
    dir:'var',
    stringify: cjson.stringify,
    parse: cjson.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
    continuous: true,
    interval: false,
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
}, function(){} ).then(function(){}, function(){});

/**
* Initialize symbl
*/
var symbl = {
	
	ai			: {},
	api			: {},
	bootstrap	: {},
	cloud		: {},
	cli			: {},
	lambda		: {},
	log			: {},
	test		: {},
	
}

module.exports = symbl;

symbl.ai				= {};
symbl.api				= express();
symbl.bootstrap			= {};
symbl.cloud				= {};
symbl.cli 				= require('commander');
symbl.graph				= {};
symbl.lambda 			= require('q');
symbl.log				= {};

symbl.api.get('/', function (req, res) {
  res.send('/');
})

symbl.api.get('/test', function(req, res) {
	res.send('/test');
});

symbl.api.get('/cloud', function(req, res) {
	res.send('/cloud');
});

symbl.cli
	.version('0.0.1')
	.option('-T, -Test', 'Execute tests.')

symbl.cli
	.command('')
	.description('')
	.action(function() {
		
	});
	
symbl.cli
	.command('test')
	.description('run test commands')
	.action(function() {
		symbl.test.run();
	});
	
symbl.cli
   .command('setup')
   .description('run setup commands')
   .action(function() {
     console.log('setup');
   });

symbl.cli
   .command('service <port>')
   .description('run as a service on <port>')
   .action(function(port) {
		if(port == undefined) { port = 80; }
		symbl.log.info("Starting service on port " + port);
		http.createServer(symbl.api).listen(port);
   });

symbl.cli
   .command('teardown <dir> [otherDirs...]')
   .description('run teardown commands')
   .action(function(dir, otherDirs) {
     console.log('dir "%s"', dir);
     if (otherDirs) {
       otherDirs.forEach(function (oDir) {
         console.log('dir "%s"', oDir);
       });
     }
   });

symbl.cli
   .command('*')
   .description('deploy the given env')
   .action(function(env) {
     console.log('deploying "%s"', env);
   });

/**
* Initialize log
*/
symbl.log = {
	
	debug	: function() {},
	error	: function() {},
	info	: function() {},
	warn	: function() {}

};

symbl.log.info = function(message, e) { console.log(message); }

/**
* Initialize test
*/
symbl.test = {
	
	benchmark	: {},
	unit		: {},
	integration	: {},
	run			: function() {}
	
};

symbl.test.benchmark = new benchmark.Suite;

symbl.test.benchmark
.add('RegExp#test', function() {
  /o/.test('Hello World!');
	})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
	})
.on('cycle', function(event) {
  console.log(String(event.target));
	})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
	})

symbl.test.run = function() {

	//symbl.test.benchmark.run({ 'async': true });	
	//cjson.stringify(symbl.test.benchmark.run({ 'async': true }))
}
	
/**
* Cli entry point
*/	
symbl.cli
   .parse(process.argv);	
   