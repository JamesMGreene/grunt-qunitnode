/*
 * grunt-qunitnode
 * https://github.com/JamesMGreene/grunt-qunitnode
 *
 * Copyright (c) 2012 JamesMGreene
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function( grunt ) {
	var QUnit = require( "qunitjs" ),
		path = require( "path" ),
		chalk = require( "chalk" ),

		// Keep track of the last-started test and status.
		next, options, currentTest, status,

		// Keep track of the last-started test(s).
		unfinished = {},

		// Keep track of failed assertions for pretty-printing.
		failedAssertions = [];

	// Allow an error message to retain its color when split across multiple lines.
	function formatMessage( str ) {
		return String( str ).split( "\n" ).map(function( s ) {
			return chalk.magenta( s );
		}).join( "\n" );
	}

	// If options.force then log an error, otherwise exit with a warning
	function warnUnlessForced( message ) {
		if ( options.force ) {
			grunt.log.error( message );
		} else {
			grunt.warn( message );
		}
	}

	function moduleAndName( details ) {
		var mod = details.module;

		mod = mod ? mod + " - " : "";

		return chalk.cyan( mod + details.name );
	}

	function logFailedAssertions() {
		var assertion;

		// Print each assertion error.
		while ( assertion = failedAssertions.shift() ) {
			grunt.verbose.or.error( moduleAndName( assertion ) );
			warnUnlessForced( "Message: " + formatMessage( assertion.message ) );

			if ( assertion.actual !== assertion.expected ) {
				warnUnlessForced( "Actual: " + formatMessage( assertion.actual ) );
				warnUnlessForced( "Expected: " + formatMessage( assertion.expected ) );
			}

			if ( assertion.source ) {
				warnUnlessForced( assertion.source.replace( / {4}(at)/g, " $1" ) );
			}

			grunt.log.writeln();
		}
	}

	QUnit.log(function( details ) {
		if ( ! details.result ) {
			failedAssertions.push( details );
		}
	});

	QUnit.testStart(function( details ) {
		var currentTest = moduleAndName( details );

		grunt.verbose.write( chalk.cyan( currentTest + "... " ) );
	});

	QUnit.testDone(function( details ) {
		var name = details.name, 
			failed = details.failed;

		// Log errors if necessary, otherwise success.
		if ( failed > 0 ) {

			// list assertions
			if ( grunt.option( "verbose" ) ) {
				grunt.log.error();
				logFailedAssertions();
			} else {
				grunt.log.write( chalk.red( "F" ) );
			}
		} else {
			grunt.verbose.ok().or.write( chalk.green( "." ) );
		}
	});

	QUnit.done(function( details ) {
		var failed = details.failed,
			passed = details.passed,
			total = details.total,
			runtime = details.runtime;

		status.failed += failed;
		status.passed += passed;
		status.total += total;
		status.runtime += runtime;

		// Print assertion errors here, if verbose mode is disabled.
		if ( !grunt.option( "verbose" ) ) {
			if ( failed > 0 ) {
				grunt.log.writeln();
				logFailedAssertions();
			} else if ( total === 0 ) {
				warnUnlessForced( "0/0 assertions ran (" + runtime + "ms)" );
			} else {
				grunt.log.ok();
			}
		}

		grunt.event.emit( "qunitnode.done", failed, passed );
		next();
	});

	grunt.registerMultiTask( "qunitnode", "QUnit tests in Node.js.", function() {		
		var done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		options = this.options({
			force: false
		});

		// Reset status.
		status = { failed: 0, passed: 0, total: 0, runtime: 0 };

		grunt.util.async.forEachSeries( this.filesSrc, function( src, nextStep ) {
			var testFile = path.resolve( src );

			grunt.event.emit( "qunitnode.spawn", src );

			QUnit.config.autostart = false;
			QUnit.init();

			grunt.verbose.subhead( "Testing " + src + " ").or.write( "Testing " + src + " " );

			// forces test file reload if already required once
			// Example: multiple grunt subtasks
			delete require.cache[ require.resolve( testFile ) ];
			require( testFile );

			QUnit.load();

			next = nextStep;
		},

		// All tests have been run.
		function() {
			if ( status.failed > 0 ) {
				warnUnlessForced( status.failed + "/" + status.total +
					" assertions failed (" + status.runtime + "ms)" );
			} else if ( status.total === 0 ) {
				warnUnlessForced( "0/0 assertions ran (" + status.runtime + "ms)" );
			} else {
				grunt.verbose.writeln();
				grunt.log.ok(status.total + " assertions passed (" + status.runtime + "ms)" );
			}

			// All done!
			done();
		});

	});
};
