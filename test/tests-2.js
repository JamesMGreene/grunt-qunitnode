QUnit.module( "passing module 2" );

QUnit.test( "foo 2", function( assert ) {
	assert.ok( true, "pass!" );
	assert.strictEqual( true, true );
});

QUnit.test( "bar 2", function( assert ) {
	assert.deepEqual( [ 1, 2, 3 ], [ 1, 2, 3 ] );
});
