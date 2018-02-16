'use strict';

function mapError(error, next) {
    switch (error.code) {
        case 11000:
            return next(500, 'There is an existing code with the given key');
            break;   
        default:
            return next(500, 'Error while persisting the entity');
            break;
    }
}

module.exports = {
    mapError
};