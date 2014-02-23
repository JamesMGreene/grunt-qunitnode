"use strict";

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				"Gruntfile.js",
				"tasks/*.js",
				"test/**/*.js",
			],
			options: {
				jshintrc: ".jshintrc",
			},
		},
		qunitnode: {
			src: "test/tests.js",
			multiple: [ "test/tests.js", "test/tests-{3,2}.js" ],
			all: {
				options: {
					force: true
				},
				src: "test/**/*.js"
			}
		}
	});

	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadTasks( "tasks" );

	// Build a mapping of url success counters.
	var successes = {};
	var currentUrl;
	grunt.event.on( "qunitnode.spawn", function( url ) {
		currentUrl = url;
		if ( !successes[ currentUrl ] ) {
			successes[ currentUrl ] = 0;
		}
	});
	grunt.event.on( "qunitnode.done", function( failed, passed ) {
		var urls = {
				"test/tests.js": [ 3, 0 ],
				"test/tests-2.js": [ 3, 0 ],
				"test/tests-3.js": [ 3, 0 ],
				"test/tests-fail.js": [ 0, 3 ],
			},
			currUrlPassed = urls[ currentUrl ][ 0 ],
			currUrlFailed = urls[ currentUrl ][ 1 ];

		if ( failed === currUrlFailed && passed === currUrlPassed ) {
			successes[ currentUrl ]++;
		}
	});

	grunt.registerTask( "really-test", "Test to see if qunit task actually worked.", function() {
		var assert = require( "assert" );
		var difflet = require( "difflet" )( { indent: 2, comment: true } );
		var actual = successes;
		var expected = {
			"test/tests.js": 3,
			"test/tests-2.js": 2,
			"test/tests-3.js": 2,
			"test/tests-fail.js": 1
		};

		try {
			assert.deepEqual( actual, expected, "Actual should match expected." );
		} catch ( err ) {
			grunt.log.subhead( "Actual should match expected." );
			console.log( difflet.compare( expected, actual ) );
			throw new Error( err.message );
		}
	});

	grunt.registerTask( "test", [ "default" ] );
	grunt.registerTask( "default", [ "jshint", "qunitnode", "really-test" ] );
};
