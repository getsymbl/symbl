/**
* Symbl.io AI as a Service Platform
* MIT License
* https://symbl.io
* https://github.com/getsymbl/symbl
*/

/**
* System dependencies
*/

const aws			= require('aws-sdk');
const benchmark		= require('benchmark');
const cryptography	= require('node-forge');
const express		= require('express');
const forge			= require('forge');
const cjson			= require('circular-json');
const getmac		= require('getmac');
const http 			= require('http');
const https 		= require('https');
const os			= require('os');
const platform		= require('platform');
const should		= require('should');
const storage 		= require('node-persist');

/**
* Dependency initialization
*/

storage.initSync( {
		dir: 'data',
		stringify: cjson.stringify,
		parse: cjson.parse,
		encoding: 'utf8',
		logging: false,
		continuous: true,
		interval: false,
		ttl: false, 
	} );

/**
* Initialize Symbl
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
symbl.repository		= {};
symbl.test				= {};

/**
* Initialize symbl repository
*/

symbl.repository = storage;

/**
* Initialize API
*/
symbl.api.get('/', function (req, res) {
	res.send('/');
})

symbl.api.get('/test', function(req, res) {
	res.send('/test');
});

symbl.api.get('/cloud', function(req, res) {
	res.send('/cloud');
});

symbl.api.get('/api', function(req, res) {
	res.send('/api');
});

symbl.bootstrap = {

	generateUuid 	: function(){},
	setup 			: function(){},
	hash			: {}	
		
}

/**
* Initialize bootstrap
*/

symbl.bootstrap.hash = cryptography.md.sha512.create();

symbl.bootstrap.generateUuid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

symbl.bootstrap.setup = function(email, password) {
	
	var userUuid = symbl.bootstrap.generateUuid();
	var userKey = symbl.bootstrap.hash.digest().getBytes();

		var setupUser = {
		
			email 		: email,
			password 	: password,
			uuid		: userUuid,

		}
		
		symbl.repository.setItemSync('user', setupUser);
		symbl.repository.persist();
		
	}

/**
* Initialize Cli
*/

symbl.cli
	.version('0.1.0')
	.option('-T, -Test', 'Execute tests.')

symbl.cli
	.command('')
	.description('')
	.action(function() {
		console.log(1);
	});
	
symbl.cli
	.command('test')
	.description('run test commands')
	.action(function() {
		symbl.test.run();
	});
	
symbl.cli
   .command('setup')
   .description('run setup <email> <password>')
   .action(function(email, password) { symbl.bootstrap.setup(email, password) } );

symbl.cli
   .command('service <host> <port>')
   .description('run as a service on <host> <port>')
   .action(function(host, port) {
		if(port == undefined) { host = "localhost", port = 80; }
		getmac.getMac(function(err,macAddress){
			if (err)  throw err;
			http.createServer(symbl.api).listen(port, host);
			symbl.log.info("Starting service on " + os.hostname() + " " + macAddress + " " + host + ":" + port);
		});
		
   });

symbl.cli
   .command('import <type> <dir> [otherDirs...]')
   .description('import entites')
   .action(function(dir, otherDirs) {
     symbl.log.debug('dir "%s"', dir);
     if (otherDirs) {
       otherDirs.forEach(function (oDir) {
         symbl.log.debug('dir "%s"', oDir);
       });
     }
   });
   
symbl.cli
   .command('export <entity> <type> <dir> [otherDirs...]')
   .description('export <entity> <type> <dir>')
   .action(function(dir, otherDirs) {
     symbl.log.debug('dir "%s"', dir);
     if (otherDirs) {
       otherDirs.forEach(function (oDir) {
         symbl.log.debug('dir "%s"', oDir);
       });
     }
   });

symbl.cli
   .command('*')
   .description('run <*>')
   .action(function(env) {
		storage.getItem('user', function (err, value) {
			console.log(value);
		}); 
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

symbl.log.debug = function(message, e) { if(true) { console.log(message); } };
symbl.log.info = function(message, e) { console.log(message); }
symbl.log.warn = function(message, e) { console.log("Warning: " + message); }
symbl.log.error = function(message, e) { console.log("Error: " + message); }

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
  symbl.log.debug(String(event.target));
	})
.on('complete', function() {
  symbl.log.debug('Fastest is ' + this.filter('fastest').map('name'));
	})

symbl.test.run = function() {

	symbl.test.benchmark.run({ 'async': true });	
	
}
	
/**
* Cli entry point
*/	

symbl.cli
	.parse(process.argv);	   
	