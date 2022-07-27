var expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
var should = require('should')
var user;

const userCredentials = {
    van_name: 'vendor_test1', 
    password: 'Yyc741108'
}

var authenticatedUser = request.agent(app);

before(function(done) {
    authenticatedUser
        .post('/vendor/login')
        .send(userCredentials)
        .end(function(err, res) {
            expect(res.statusCode).to.equal(302);
            expect('Location', '/vendor');
            done();
        });
});

describe('integration tests', function () {
    describe('setting vendor status', function() {
        it('should return a 200 response if we can visit the vendor page', function(done){
            authenticatedUser.get('/vendor')
            .expect(200, done);
        });
        it('open the vendor and specify the location string', function(done){          
            let location = {
                location: "uni"
            }
            authenticatedUser
                .post('/vendor')
                .send(location)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) done(err);
                    res.body.should.have.property('location').eq('uni')
                    res.body.should.have.property('isOpen').eq(true)
                });
                done();
            
        });
        it('close the vendor', function(done){          
            authenticatedUser
                .post('/vendor/closeVan')
                .expect(200)
                .end(function(err, res) {
                    if (err) done(err);
                    res.body.should.have.property('isOpen').eq(false)
                });
                done();
        });
    });
})

module.exports = app;
