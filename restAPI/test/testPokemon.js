/**
* This is a set of mocha tests to verify if the pokemon model is being correctly
* created and if the connections to the database are being created.
* TODO: create separate set for model tests
* @author JICR
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
require('dotenv').load();

var keystone = require('keystone');
var chai = require('chai');
var dbURI = 'localhost:27017';

keystone.init({
  'name': 'Pokemon model test',
  's3 config': {} //has to be set, but isn't used in our models
});

var Pokemon = null;

keystone.import('../models');

chai.should();

// ---------- Test for Pokemon model ----------
describe('Pokemon', function(){
  beforeEach(function(done){
    // before each test tries to connect keystone to mongoose
    if (keystone.mongoose.connection.db) return done();
    console.log('Connecting to mongoDB: '+dbURI);
    keystone.mongoose.connect(dbURI,done);
  });

  it('should be a connection to Mongo', function(done){
    // verifies if the connection to mongo is valid
    keystone.mongoose.connection.db.should.be.a('Object');
    done();
  });

  it('should be a mongoose model', function(done){
    Pokemon = keystone.list('pokemons');

    // verifies if the model is being created correctly
    Pokemon.should.be.a('Object');
    Pokemon.should.have.property('model').be.a('Function');
    Pokemon.should.have.property('schema').be.a('Object');

    // verifies if the model has the required fields
    Pokemon.schema.paths.pokid.should.be.a('Object');
    Pokemon.schema.paths.name.should.be.a('Object');
    Pokemon.schema.paths.type.should.be.a('Object');
    Pokemon.schema.paths.total.should.be.a('Object');
    Pokemon.schema.paths.hp.should.be.a('Object');
    Pokemon.schema.paths.attack.should.be.a('Object');
    Pokemon.schema.paths.defense.should.be.a('Object');
    Pokemon.schema.paths.specialAttack.should.be.a('Object');
    Pokemon.schema.paths.specialDefense.should.be.a('Object');
    Pokemon.schema.paths.speed.should.be.a('Object');
    done();
  });
});
