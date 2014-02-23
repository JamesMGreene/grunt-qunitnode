QUnit.module( "passing module" );

QUnit.test( "foo", function( assert ) {
	assert.ok( true, "pass!" );
	assert.strictEqual( true, true );
});

QUnit.test( "bar", function( assert ) {
	assert.deepEqual( [ 1, 2, 3 ], [ 1, 2, 3 ] );
});
