QUnit.module( "passing module 3" );

QUnit.test( "foo 3", function( assert ) {
	assert.ok( true, "pass!" );
	assert.strictEqual( true, true );
});

QUnit.test( "bar 3", function( assert ) {
	assert.deepEqual( [ 1, 2, 3 ], [ 1, 2, 3 ] );
});
