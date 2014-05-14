# grunt-qunitnode [![Build Status: Linux](https://travis-ci.org/JamesMGreene/grunt-qunitnode.png?branch=master)](https://travis-ci.org/JamesMGreene/grunt-qunitnode)

> A Grunt task plugin to execute QUnit tests in Node.js.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qunitnode --save-dev
```

## Using

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks( 'grunt-qunitnode' );

grunt.initConfig({
	qunitnode: {
		src: [ "test/mylib_test_a.js", "test/mylib_test_b.js" ]
	}
});
```

### Source/Test Files

You should call your test files here. As in Node you can require the files to be tested in your test files, it's not necessary to load those via grunt. Otherwise, simply add them first.

This next example calls the source file that will be tested as well:

```js
grunt.initConfig({
	qunitnode: {
		all: [ "src/mymodule.js", "test/mymodule.js" ]
	}
});
```

### Globbing Patterns a.k.a. Wildcards

This plugin support Grunt [Globbing Patterns](http://gruntjs.com/configuring-tasks#globbing-patterns), as seen in the example below:  

```js
// Project configuration.
grunt.initConfig({
	qunitnode: {
		all: [ "test/**/*.js" ]
	}
});
```

## Node QUnit task
_Run this task with the `grunt qunitnode` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### force
Type: `boolean`
Default: `false`

When true, the whole task will not fail when there are individual test failures, or when no assertions for a test have run. This can be set to true when you always want other tasks in the queue to be executed.
