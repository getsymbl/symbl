/**
* Symbl.io AI as a Service Platform
* MIT License
* https://symbl.io
* https://github.com/getsymbl/symbl
*/

/**
* System dependencies
*/

/* jslint node: true */
/* jslint esnext: true */

const VERSION		= '1.1.0';
const HOST			= '0.0.0.0';
const PORT			= '8484';

const aws			= require('aws-sdk');
const benchmark		= require('benchmark');
const bodyParser 	= require('body-parser');
const cjson			= require('circular-json');
const cryptography	= require('node-forge');
const cluster		= require('cluster');
const express		= require('express');
const forge			= require('forge');
const getmac		= require('getmac');
const gremlin		= require('gremlin');
const http 			= require('http');
const https 		= require('https');
const opn 			= require('opn');
const os			= require('os');
const platform		= require('platform');
const should		= require('should');
const storage 		= require('node-persist');
const lave 			= require('lave');
const uneval 		= require('uneval');
const generate 		= require('escodegen').generate;
const toSource 		= require('tosource');
const cons 			= require('consolidate');
const url			= require('url');
const vm			= require('vm');
const hornSAT 		= require('horn-sat');

/**
* Dependency initialization
*/

/**
* Initialize Symbl
*/

var symbl = {
	
	ai			: {},
	api			: {},
	artifact	: {},
	bootstrap	: {},
	cloud		: {},
	cli			: {},
	enterprise	: {},
	execution	: {},
	lambda		: {},
	log			: {},
	market		: {},
	schema		: {},
	test		: {},
	
};

symbl.ai				= {};
symbl.api				= express();
symbl.artifact			= {};
symbl.bootstrap			= {};
symbl.cloud				= {};
symbl.cli 				= require('commander');
symbl.enterprise		= {};
symbl.execution			= {};
symbl.graph				= {};
symbl.lambda 			= require('q');
symbl.log				= {};
symbl.market			= {};
symbl.repository		= {};
symbl.schema			= {};
symbl.test				= {};

/**
* Initialize symbl repository
*/

symbl.repository = storage;

symbl.repository.initSync({
		dir:  __dirname + '/data',
		stringify: toSource,
		parse: eval,
		encoding: 'utf8',
		logging: false,
		continuous: true,
		interval: false,
		ttl: true, 
});

/**
* Initialize AI
*/

symbl.ai = {
	
	entityPrototype		: 
	{
		id		: "",
		name	: "",
		model	: {},
	},
	id		: "",
	name	: "",
	execute : function(options, callback) {
		symbl.lambda.execute(options, callback);
	},
	init : function(options, callback) {
		symbl.ai.id = symbl.bootstrap.generateUuid();
		symbl.ai.name = options.name;
		symbl.repository.setItemSync(symbl.ai.id, symbl);
		symbl.repository.persist();
		symbl.log.info(symbl.ai.id);
	},
	search : function(options, callback) {
		
		return symbl.repository.values();
		
	},
	match : function(options, callback) {
		
	},
	repository : require('node-persist').initSync({
		dir:  __dirname + '/data',
		stringify: cjson.stringify,
		parse: cjson.parse,
		encoding: 'utf8',
		logging: false,
		continuous: true,
		interval: false,
		ttl: true, 
	})
	
};

/**
* Initialize Artifact
*/

symbl.artifact = {
	id			: "",
	name 		: "",
	code		: "",
	resources	: 0,
};

/**
* Initialize API
*/

symbl.api.use(express.static('resources'));
symbl.api.use(bodyParser.json());
symbl.api.engine('html', cons.nunjucks);
symbl.api.set('view engine', 'html');
symbl.api.set('views', __dirname + '/resources/views');

symbl.api.get('/', function (req, res) {
	res.send();
});

symbl.api.get('/ai', function(req, res) {
	res.send(cjson.stringify(symbl.ai));
});

symbl.api.post('/ai', function(req, res) {
	res.send(cjson.stringify(symbl.ai.init(req)));
});

symbl.api.post('/add', function(req, res) {
	symbl.cli.parse(['add']);	
});

symbl.api.get('/api', function(req, res) {
	res.send(cjson.stringify(symbl.api));
});

symbl.api.get('/bootstrap', function(req, res) {
	res.send(cjson.stringify(symbl.bootstrap));
});

symbl.api.post('/bootstrap', function(req, res) {
	res.send(cjson.stringify(symbl.bootstrap.init(req)));
});

symbl.api.get('/graph', function(req, res) {
	res.send(cjson.stringify(symbl.graph));
});

symbl.api.get('/schema', function(req, res) {
	res.send(cjson.stringify(symbl.schema));
});

symbl.api.get('/repository', function(req, res) {
	res.send(cjson.stringify(symbl.repository));
});

symbl.api.get('/test', function(req, res) {
	res.send(cjson.stringify(symbl.test));
});

symbl.api.get('/cloud', function(req, res) {
	res.send(cjson.stringify(symbl.cloud));
});

symbl.api.get('/add', function(req, res) {
	res.render('add', {
	title: 'Add',
	symbl: symbl
	});
});


symbl.api.get('/setup', function(req, res){
	res.render('setup', {
	title: 'Setup',
	symbl: symbl
	});
});

symbl.api.get('/status', function(req, res){
	res.render('status', {
	title: 'Status',
	symbl: symbl
	});
});

symbl.api.get('/login', function(req, res){
	res.render('login', {
	title: 'Login',
	symbl: symbl
	});
});

symbl.api.get('/users', function(req, res){
	res.render('users', {
	title: 'Users',
	symbl: symbl
	});
});

symbl.api.get('/document', function(req, res){
	res.render('document', {
	title: 'Document',
	symbl: symbl
	});
});

symbl.api.get('/encode', function(req, res){
	res.render('encode', {
	title: 'Encode',
	symbl: symbl
	});
});

symbl.api.get('/execute', function(req, res){
	res.render('execute', {
	title: 'Execute',
	symbl: symbl
	});
});


/**
* Initialize bootstrap
*/

symbl.bootstrap = {
	entityPrototype		: 
	{
		id		: "",
		name	: "",
		model	: {},
	},
	id				: "",
	name			: "",
	model			: {},
	copy			: function(options, callback) {
		
	},
	execute			: function(options, callback) {},
	debug			: function(options, callback) {
		symbl.repository.getItem(options.id, function (err, value) {
			symbl.log.debug(value);
		});
	},
	hash			: {},	
	generateUuid 	: function(options, callback) {},
	install			: function(options, callback) {},
	match			: function(options, callback) {},
	resources		: 0,
	salt			: "",
	search			: function(options, callback) {},
	setup 			: function(options, callback) {},
	test			: function(options, callback) {
		return this.copy(symbl.bootstrap);
	},
	repository 		: {},
	version			: VERSION

};

symbl.bootstrap.init = function(options, callback) {

	if(symbl.bootstrap.id !== undefined && symbl.bootstrap.name !== undefined) {
		symbl.bootstrap.id = symbl.bootstrap.generateUuid();
		symbl.bootstrap.hash.update(symbl.bootstrap.id + symbl.bootstrap.salt);
		symbl.bootstrap.name = symbl.bootstrap.hash.digest().toHex();
		symbl.repository.setItemSync(symbl.bootstrap.id, symbl);
		symbl.repository.persist();
		console.log(symbl.bootstrap.id);
	} else {
		
	
	}
	
};

symbl.bootstrap.install = function(options, callback) {
	
	var parsedUrl = url.parse(options.uri);
	
	http.get({
	  hostname: parsedUrl.hostname,
	  port: parsedUrl.port,
	  path: parsedUrl.path,
	  agent: false  
	}, (res) => {
	  var body = '';
	  res.on('data', function(chunk) {
		body += chunk;
	  });
	  res.on('end', function() {
		symbl.bootstrap.model = cjson.parse(body);
		symbl.bootstrap.init();
	  });
	});
		
	
};

symbl.bootstrap.execute = function(options, callback) {

	symbl.log.debug(options.id);
	if(options.id !== "") {
	
		symbl.repository.getItem(options.id, function (err, value) {
			symbl.ai.execute({});
		});
	
	} else {
		
		symbl.repository.values();
		
		
	}
	
	if (callback && typeof(callback) === "function") {
		callback();
	}
	
};

symbl.bootstrap.hash = cryptography.md.sha512.create();

symbl.bootstrap.generateUuid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

symbl.bootstrap.match = function(options, callback){
	
	
	
};

symbl.bootstrap.salt = cryptography.random.getBytesSync(32).toString('hex');

symbl.bootstrap.search = function(options, callback){
		
};

symbl.bootstrap.service = function(options, callback) {

	if(options.port === undefined) { 
		options.host = HOST;
		options.port = PORT;
	}
	getmac.getMac(function(err,macAddress){
		if (err)  throw err;
		http.createServer(symbl.api).listen(options.port, options.host);
		symbl.log.info("Starting service on " + os.hostname() + " " + macAddress + " " + options.host + ":" + options.port);
		symbl.bootstrap.init();
		opn('http://localhost:' + options.port);
	});
	
};

symbl.bootstrap.setup = function(email, password) {
	
	var userUuid = symbl.bootstrap.generateUuid();
	var userKey = symbl.bootstrap.hash.digest().getBytes();

		var setupUser = {
		
			email 				: email,
			emailSecondary		: "",
			mobile				: "",
			password 			: password,
			publicKey			: "",
			privateKey			: "",
			uuid				: userUuid,
			services			: {}

		};
		
		symbl.repository.setItemSync('user', setupUser);
		symbl.repository.persist();
		
};

/**
* Initialize Cli
*/

symbl.cli
	.version(symbl.bootstrap.version)
	.option('-T, -Test', 'Execute tests.');

symbl.cli
	.command('test')
	.description('run test commands')
	.action(function() {
		symbl.test.run();
	});	

symbl.cli
	.command('init')
	.description('init')
	.action(function() { symbl.bootstrap.init(); });

symbl.cli
	.command('execute')
	.description('execute <id>')
	.action(function(id) { symbl.bootstrap.execute({id : id}); });

symbl.cli
	.command('go')
	.description('execute all known ids')
	.action(function() { symbl.bootstrap.execute({id : ""}); });
	
symbl.cli
	.command('debug')
	.description('debug <id>')
	.action(function(id) { symbl.bootstrap.debug({id : id}); });
	
symbl.cli
   .command('setup')
   .description('run setup <email> <password>')
   .action(function(email, password) { symbl.bootstrap.setup(email, password); });
   
symbl.cli
   .command('install <uri>')
   .description('install <uri>')
   .action(function(uri) { symbl.bootstrap.install({uri : uri}); });

symbl.cli
	.command('add <name>')
	.description('add <name>')
	.action(function(name) { symbl.ai.init({name : name}); });
   
symbl.cli
	.command('graph init <schema> <graph>')
	.description('graph init <schema> <graph>')
	.action(function(schema, graph) { symbl.graph.init(schema, graph); });
   
symbl.cli
	.command('schema init <schema>')
	.description('schema init <schema>')
	.action(function(schema) { symbl.schema.init(schema); });
   
symbl.cli
   .command('service <host> <port>')
   .description('run as a service on <host> <port>')
   .action(function(host, port) {
		symbl.bootstrap.service({host:host, port:port});	
});
   
symbl.cli
   .command('up')
   .description('run as a service on ' + HOST + ':' + PORT)
   .action(function(host, port) {
		symbl.bootstrap.service({host:host, port:port});	
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
   .description('<*>')
   .action(function(env) {
	   if(env === null || env === undefined || env === "") {
		   console.log("Usage: symbl <command>");
	   }
	   
});

/**
* Initialize cloud
*/

symbl.cloud = {

	entityPrototype	: {
		
		name 	: "",
		graphs	: {},
		
	},
	add			: function() {
		
	},
	remove		: function() {},
	copy		: function() {},

};	
   
/**
* Initialize graph
*/   

symbl.graph = {
	
	entityPrototype	: 
	{
		x 				: 0,
		y 				: 0,
		z 				: 0,
		name			: "",
		cssClass 		: "",
		schema			: ""
	},
	copy				: function(entity) {
		
	},					
	addNode				: function() {},
	addConnection 		: function() {},
	removeNode			: function() {},
	removeConnection	: function() {},
	fold				: function() {},
	intersection		: function() {},
	metric				: function() {},
	search				: function(id, options, callback) {
		
	},
	model				: {},
	test				: function() {
		
		return this.copy(symbl.graph);
		
	},
	
};

symbl.schema = {
	
	entityPrototype		: 
	{
		id		: "",
		name	: "",
		model	: {},
	},
	copy	: function(entity) {
		return cjson.parse(cjson.stringify(entityPrototype));
	},
	init	: function(name, options, callback) {
		var schema = symbl.schema.copy(entityPrototype);
		schema.id = symbl.bootstrap.generateUuid();
		schema.name = name;
		symbl.repository.setItemSync(schema.id, schema);
		symbl.repository.persist();
	},
	search	: function(id, options, callback) {
		
	},
	test	: function() {
		return this.copy(symbl.schema);
	}
	
};

/**
* Initialize lambda
*/

symbl.lambda = {
	id				: "",
	name			: "",
	entityPrototype		:
	{
		name	: "",
		code	: "",
	},
	execute : function(options, callback) {
		if (callback && typeof(callback) === "function") {
			callback();
		}
	},
	test	: function(options, callback) {
		return this.copy(symbl.lambda);
	},
	copy	: function(options, callback) {

	},
};

/**
* Initialize log
*/

symbl.log = {
	
	debug	: function() {},
	error	: function() {},
	info	: function() {},
	warn	: function() {},
	test	: function() {
		return this.copy(symbl.log);
	},
	copy	: function(entity) {

	},

};

symbl.log.debug = function(message, e) { if(true) { console.log(message); } };
symbl.log.info = function(message, e) { console.log(message); };
symbl.log.warn = function(message, e) { console.log("Warning: " + message); };
symbl.log.error = function(message, e) { console.log("Error: " + message); };

/**
* Initialize test
*/

symbl.test = {
	
	benchmark	: {},
	unit		: {},
	integration	: {},
	run			: function() {},
	status		: "OK"
	
};

symbl.test.benchmark = new benchmark.Suite();

symbl.test.benchmark
.add('symbl.graph.test', function(){
	symbl.graph.test();
	})
.add('symbl.ai.test', function(){
	symbl.ai.test();
	})
.add('symbl.lambda.test', function(){
	symbl.lambda.test();
	})
.add('symbl.log.test', function(){
	symbl.log.test();
	})
.on('cycle', function(event) {
  symbl.log.debug(String(event.target));
	})
.on('complete', function() {
  symbl.log.debug('Fastest is ' + this.filter('fastest').map('name'));
	});

symbl.test.execute = function() {

	return symbl.test.run();
	
};	
	
symbl.test.run = function() {

	return symbl.test.benchmark.run({ 'async': true });	
	
};
	
/**
* Cli entry point
*/	

symbl.cli
	.parse(process.argv);	   

/**
* AI entry point
*/	
symbl.ai
	.execute(process.argv);
	
module.exports = symbl;

