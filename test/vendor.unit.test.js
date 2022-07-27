var sinon = require('sinon');
var expect = require('chai').expect;
var assert = require('chai').assert;
var should = require('chai').should();
const Vendor = require('../models/vendor');
var async = require("async");

describe('unit tests', function () {

    var id = "60a3747f147782aae028a292";

    describe('get one vendor', function () {
        it("tested vendor's \"isOpen\" status should be false", function () {
            async.parallel(
                {
                    vendor: function (callback) {
                        Vendor.findById(id, {}).exec(callback);
                    },
                },
                function (err, results) {
                    if (err) {
                        return next(err);
                    } // Error in API usage.
                    if (results.vendor == null) {
                        // No results.
                        var err = new Error("Vendor not found");
                        err.status = 404;
                        return next(err);
                    }
                    // Successful, so run test.
                    expect(vendor.isOpen).to.equal(false);
                }
            );
        })
        it("corresponding vendor name should be \"vendor_test2\"", function () {
            async.parallel(
                {
                    vendor: function (callback) {
                        Vendor.findById(id, {}).exec(callback);
                    },
                },
                function (err, results) {
                    if (err) {
                        return next(err);
                    } // Error in API usage.
                    if (results.vendor == null) {
                        // No results.
                        var err = new Error("Vendor not found");
                        err.status = 404;
                        return next(err);
                    }
                    // Successful, so run test.
                    expect(vendor.isOpen).to.equal("vendor_test2");
                }
            );
        })
        it("corresponding vendor ID should be \"071c\"", function () {
            async.parallel(
                {
                    vendor: function (callback) {
                        Vendor.findById(id, {}).exec(callback);
                    },
                },
                function (err, results) {
                    if (err) {
                        return next(err);
                    } // Error in API usage.
                    if (results.vendor == null) {
                        // No results.
                        var err = new Error("Vendor not found");
                        err.status = 404;
                        return next(err);
                    }
                    // Successful, so run test.
                    expect(vendor.isOpen).to.equal("071c");
                }
            );
        })
    })
})
