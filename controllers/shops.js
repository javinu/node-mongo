const Shop = require('../models/shop');
const util = require('../utils/mongoErrorMapper');

function create(request, response, next) {
    if (validateRequestCreateBody(request.body)) {
        let shop = new Shop({
            name: request.body.name,
            location: request.body.location,
            products: request.body.products
        });

        shop.save(function (err) {
            if (err) {
                util.mapError(err, function(httpCode, message) {
                    response.status(httpCode).send(message);
                });
            } else {
                response.status(201).send('The shop has been created');
            }
        });
    } else {
        response.status(400).send('The body is invalid');
    }
}

function update(request, response, next) {
    if (validateRequestId(request.params.id)) {
        Shop.findById(request.params.id, function (err, shop) {
            if (err) {
                response.status(500).send('Oops, an error ocurred');
            }

            if (!shop) {
                response.status(404);
            } else {
                if (validateRequestUpdateBody(request.body)) {
                    if (request.body.description) {
                        shop.description = request.body.description;
                    }
                    if (request.body.products) {
                        shop.products = request.body.products;
                    }                

                    shop.save(function (err) {
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

function findAll(request, response, next) {
    Shop.find({}, function (err, shops) {
        if (err) {
            response.status(500).send(err);
        }

        response.send(shops);
    });
}

function findByQuery(request, response, next) {
    if (validateRequestQueryString(request.query)) {
        Shop.find({ description: request.query.description }, function (err, shops) {
            if (err) {
                response.status(500).send('Oops, an error ocurred');
            }

            response.send(shops);
        });
    } else {
        response.status(400).send('The search query is not valid');
    }
}

function findById(request, response, next) {
    if (validateRequestId(request.params.id)) {
        Shop.findById(request.params.id, function (err, shop) {
            if (err) {
                response.status(500).send('Oops, an error ocurred');
            }

            if (!user) {
                response.status(404);
            }
            response.send(shop);
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
    if (query.description) {
        return true;
    }

    return false;
}

function validateRequestUpdateBody(body) {
    return true;
}

function validateRequestCreateBody(body) {
    if (body.name === undefined) {
        return false;
    }

    return true;
}

module.exports = {
    create,
    update,
    findAll,
    findByQuery,
    findById
};