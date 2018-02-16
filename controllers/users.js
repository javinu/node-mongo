const userModel = require('../models/user');
const util = require('../utils/mongoErrorMapper');

function createUser(request, response, next) {
    if (validateRequestCreateBody(request.body)) {
        let user = userModel({
            name: request.body.name,
            username: request.body.username,
            password: request.body.password
        });

        user.save(function (err) {
            if (err) {
                util.mapError(err, function(httpCode, message) {
                    response.status(httpCode).send(message);
                });
            } else {
                response.status(201).send('The user has been created');
            }
        });
    } else {
        response.status(400).send('The body is invalid');
    }
}

function updateUser(request, response, next) {
    if (validateRequestId(request.params.id)) {
        user.findById(request.params.id, function (err, user) {
            if (err) {
                response.status(500).send('Oops, an error ocurred');
            }

            if (!user) {
                response.status(404);
            } else {
                if (validateRequestUpdateBody(request.body)) {
                    if (request.body.location) {
                        user.location = request.body.location;
                    }
                    if (request.body.name) {
                        user.name = request.body.name;
                    }
                    if (request.body.admin) {
                        user.admin = request.body.admin;
                    }

                    user.save(function (err) {
                        if (err) {
                            response.status(500).send('Oops, an error ocurred');
                        }

                        response.send('The user has been updated');
                    });
                } else {
                    response.status(400).send('the body is not valid');
                }
            }
        });
    }
}

function findUsers(request, response, next) {
    user.find({}, function (err, users) {
        if (err) {
            response.status(500).send('Oops, an error ocurred');
        }

        response.send(users);
    });
}

function findUsersByQuery(request, response, next) {
    if (validateRequestQueryString(request.query)) {
        user.find({ username: request.query.username }, function (err, users) {
            if (err) {
                response.status(500).send('Oops, an error ocurred');
            }

            response.send(users);
        });
    } else {
        response.status(400).send('The search query is not valid');
    }
}

function findUserById(request, response, next) {
    if (validateRequestId(request.params.id)) {
        user.findById(request.params.id, function (err, user) {
            if (err) {
                response.status(500).send('Oops, an error ocurred');
            }

            if (!user) {
                response.status(404);
            }
            response.send(user);
        });
    } else {
        response.status(400).send('The id is not valid');
    }
}

function validateRequestId(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
    }

    return false;
}

function validateRequestQueryString(query) {
    if (query.username) {
        return true;
    }

    return false;
}

function validateRequestUpdateBody(body) {
    if (body.admin) {
        if (typeof body.admin != 'boolean') {
            return false;
        }
    }

    return true;
}

function validateRequestCreateBody(body) {
    if (body.username === undefined || body.name === undefined || body.password === undefined) {
        return false;
    }
    if (body.admin) {
        if (typeof body.admin != 'boolean') {
            return false;
        }
    }

    return true;
}

module.exports = {
    createUser,
    updateUser,
    findUsers,
    findUsersByQuery,
    findUserById
};