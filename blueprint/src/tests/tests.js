var nimble = require('nimbleservice'),
    config = require("../config"),
    mongoose = nimble.mongoose,
    app = true,
    express,
    server,
    should = require('should'),
    assert = require('assert'),
    http = require('http'),
    fs = require('fs'),
    controller = require("../controller"),
    router = require("../router"),
    response = function (callback) {
        return {
            json : function (data) {
                callback(data);
            }
        }
    };

mongoose.connect(config.mongodb.testdb);

var requestOptions = function (post_data, path, method) {
    return {
      host: config.localhost,
      port: config.port,
      path: path || '/',
      method: method || 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length
      }
    }
};


describe('Nimble should Start'.magenta, function() {

    before(function(done) {
        nimble.server(function(ap, expr, serv) {
            app = ap;
            express = express;
            server = serv;
            done();
        });
    });

    it('app object should exist', function(done) {
        should.exist(app);
        done();
    });

    it('should be listening on port ' + config.port, function(done) {
        assert.equal(server.address().port, config.port);
        done();
    });

});

describe('Should Prevent Access if the policy is rejected'.magenta, function() {

    describe("403".magenta, function () {

        router.GET.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a GET request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("", route.path.replace(':', ''));
                    http.get(headers, function(res) {
                        res.statusCode.should.eql(403);
                        done();
                    });
                });
            }
        });

        router.POST.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a POST request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("{}", route.path.replace(':', ''), 'POST'),
                        req = http.request(headers, function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    req.write('{}');
                    req.end();
                });
            }
        });

        router.PUT.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a PUT request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("{}", route.path.replace(':', ''), 'PUT'),
                        req = http.request(headers, function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    req.write('{}');
                    req.end();
                });
            }
        });

        router.DELETE.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a GET request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("", route.path.replace(':', ''), 'DELETE');
                    http.get(headers, function(res) {
                        res.statusCode.should.eql(403);
                        done();
                    });
                });
            }
        });
    });

});

describe('This service will provide 404 for routes that are not handled by by this service'.magenta, function() {
    describe("404".magenta, function () {

        it('should respond with status code 404 when on GET request to an unknown route', function(done) {
            var headers = requestOptions("",'/foobarbazznimblecool9870298437');
            http.get(headers, function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on POST request to an unknown route', function(done) {
            var headers = requestOptions("",'/foobarbazznimblecool9870298437', 'POST');
            http.get(headers, function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on DELETE request to an unknown route', function(done) {
            var headers = requestOptions("",'/foobarbazz/nimble', 'DELETE');
            http.get(headers, function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 on a PUT request to an unknown route', function(done) {
            var headers = requestOptions("{}",'/asdfasdh87h87h8hdnf/78699786234', 'PUT'),
                req = http.request(headers, function(res) {
                    res.statusCode.should.eql(404);
                    done();
                });
                req.write('{}')
                req.end()
        });

        it('should respond with status code 404 on a POST request to an unknown route', function(done) {
            var headers = requestOptions("{}",'/asdfasdf/78699786234', 'POST'),
                req = http.request(headers, function(res) {
                    res.statusCode.should.eql(404);
                    done();
                });
                req.write('{}')
                req.end()
        });
    });
});
