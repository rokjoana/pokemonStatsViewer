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

var averageEndpoint = '/api/stats/average?';
var pokAttribute = 'attribute=';

describe('GET /stats/average', function() {
	it('test if API answer exists', function(done) {
		var testAPIEndpoint = averageEndpoint + pokAttribute + 'hp';
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

	it('test if API answer is correctly structured', function(done) {
		var testAPIEndpoint = averageEndpoint + pokAttribute + 'hp';
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
					var data = res.body;
					expect(data).to.exist;
					expect(data).to.not.be.empty;
					// for HP it should only have an element
					expect(data).to.have.length(1);
					expect(data[0]).to.exist;
					// property key exists
					expect(data[0]).to.have.property('key');
					expect(data[0]['key']).to.exist;
					expect(data[0]['key']).to.have.string('HP');

					expect(data[0]).to.have.property('values');
					expect(data[0]['values']).to.exist;
					expect(data[0]['values']).to.not.be.empty;

					// call mocha callback to end asynchronous test
					done();
				}
			});
	});

	it('test for an attribute that does not exist', function(done) {
		var testAPIEndpoint = averageEndpoint + pokAttribute + 'XX';
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
					expect(res.body).to.be.empty;
					// call mocha callback to end asynchronous test
					done();
				}
			});
	});

});
