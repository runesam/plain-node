const controllers = require('../controllers');

module.exports = route => controllers[route] || controllers.notFound;
