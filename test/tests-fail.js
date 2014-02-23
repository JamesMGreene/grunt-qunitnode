QUnit.module( "not passing module" );

QUnit.test( "foo", function( assert ) {
	assert.ok( 0, "you shall not pass!" );
	assert.strictEqual( true, false );
});

QUnit.test( "bar", function( assert ) {
	assert.deepEqual( [ 1, 2, 3 ], [] );
});
