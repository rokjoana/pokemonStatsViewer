/**
 * This is a set of mocha tests to verify if the REST API is returning correct
 * values. It uses supertest to make the calls to the API.
 * WARNING: The application should be running prior to testing
 * @author JICR
 */
var testConfig = require('./configTest');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var supertest = require('supertest');

// global variable for API accessing in tests
var api = supertest('http://' + testConfig.apiEndpoint + ':' + testConfig.apiPort);

var percentileEndpoint = '/api/stats/percentile?';
var pokId = 'pokid=';
var pokType = 'type=';
var pokAttr = 'attribute=';

/**
 * Test suite that verifies if the API is returning correct values for the
 * percentile property
 */
describe('GET /stats/percentile', function() {
	it('test if API answer exists', function(done) {
		var testAPIEndpoint =
			percentileEndpoint + pokId + '001&' + pokType + 'GRASS&' + pokAttr + 'hp';

		api.get(testAPIEndpoint)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200, function(err, res) {
				if (err) {
					return done(err);
				} else {
					// verify if the response exists
					expect(res).to.exist;
					// verify if the body of the response exists
					expect(res.body).to.exist;
					// call mocha callback to end asynchronous test
					done();
				}
			});
	});

	it('test if the response is correctly structured', function(done) {
		var testAPIEndpoint =
			percentileEndpoint + pokId + '001&' + pokType + 'GRASS&' + pokAttr + 'hp';

		api.get(testAPIEndpoint)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200, function(err, res) {
				if (err) {
					return done(err);
				} else {
					var data = res.body;

					expect(data).to.have.property('value');
					expect(data.value).to.be.above(0);

					expect(data).to.have.property('datum');
					expect(data.datum).to.not.be.empty;
					done();
				}
			});
	});

	it('test for a pokemon that does not exist', function(done) {
		var testAPIEndpoint =
			percentileEndpoint + pokId + 'XXX&' + pokType + 'GRASS&' + pokAttr + 'hp';
		api.get(testAPIEndpoint)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200, function(err, res) {
				if (err) {
					return done(err);
				} else {
					expect(res.body).to.be.empty;
					done();
				}
			});
	});

	it('test for an type that does not exist', function(done) {
		var testAPIEndpoint =
			percentileEndpoint + pokId + '001&' + pokType + 'XXXX&' + pokAttr + 'hp';
		api.get(testAPIEndpoint)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200, function(err, res) {
				if (err) {
					return done(err);
				} else {
					expect(res.body).to.be.empty;
					done();
				}
			});
	});

	it('test for an attribute that does not exist', function(done) {
		var testAPIEndpoint =
			percentileEndpoint + pokId + '001&' + pokType + 'GRASS&' + pokAttr + 'XX';
		api.get(testAPIEndpoint)
			.set('Accept', 'application/json')
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(200, function(err, res) {
				if (err) {
					return done(err);
				} else {
					expect(res.body).to.be.empty;
					done();
				}
			});
	});

});
