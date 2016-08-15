module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
		  files: ['Gruntfile.js', '*.js', 'src/**/*.js', 'test/**/*.js'],
		  options: {
			globals: {
			  jQuery: true
			}
		  }
		},
		watch: {
		  files: ['<%= jshint.files %>'],
		  tasks: ['jshint']
		},
		mochaTest: {
		  test: {
			options: {
			  reporter: 'spec',
			  captureFile: 'results.txt', // Optionally capture the reporter output to a file 
			  quiet: false, // Optionally suppress output to standard out (defaults to false) 
			  clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
			},
			src: ['test/**/*.js']
		  }
		},
		mochacov: {
			options: {
			  reporter: 'html-cov',
			  require: ['should'],
			  output: 'coverage.html'
			},
			all: ['test/*.js']
		},
		dock: {
		  options: {
		  
			docker: {
			  // docker connection 
			  // See Dockerode for options 
			},
		  
			// It is possible to define images in the 'default' grunt option 
			// The command will look like 'grunt dock:build' 
			images: {
			  'symbl': { // Name to use for Docker 
				dockerfile: 'Dockerfile',
				options: { 
				  build:   { /* extra options to docker build   */ },
				  create:  { /* extra options to docker create  */ },
				  start:   { /* extra options to docker start   */ },
				  stop:    { /* extra options to docker stop    */ },
				  kill:    { /* extra options to docker kill    */ },
				  logs:    { /* extra options to docker logs    */ },
				  pause:   { /* extra options to docker pause   */ },
				  unpause: { /* extra options to docker unpause */ }
				}
			  }
			}
		  }
		} // dock   
	  });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-cov');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-dock');
	grunt.registerTask('default', ['jshint', 'mochaTest', 'mochacov']);

};