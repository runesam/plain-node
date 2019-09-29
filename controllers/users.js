const { user } = require('./../models');
const dataLib = require('./../lib/data');
const { dataChecker, dataMapper, hash, validators } = require('./../utils');

const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];

const handlers = {
    POST({ body }) {
        console.log(body);
        return new Promise((resolve, reject) => {
            const errors = dataChecker(body, user);
            if (errors) {
                reject({ status: 400, errors });
            } else {
                dataLib.read('users', body.phone)
                    .then(() => reject({
                        status: 409,
                        errors: `a user exists in db with phone number of ${body.phone}`,
                    }))
                    .catch(() => {
                        const hashedPassword = hash(body.password)
                        const mappedData = dataMapper({ ...body, password: hashedPassword }, user);
                        dataLib.create('users', body.phone, mappedData)
                            .then(result => resolve({ status: 200, result }))
                            .catch(errors => reject({ status: 500, errors }));
                    });
            }
        });
    },
    GET({ queryStrings: { phone } }) {
        return new Promise((resolve, reject) => {
            const phoneValidator = user.phone.validate;
            const invalid = phoneValidator.reduce((acc, item) => {
                const result = validators[item](phone, user.phone);
                if (result) {
                    acc = typeof acc === 'object' ? acc : {};
                    acc[item] = result;
                }
                return acc;
            }, false);

            if (invalid) {
                reject({ status: 400, errors: { phone: invalid } });
            } else {
                dataLib.read('users', phone)
                    .then(result => resolve({ status: 200, result }))
                    .catch(errors => reject({ status: 404, errors }));
            }
        });
    },
    PUT({ body }) {
        return new Promise((resolve, reject) => {
            const phoneValidator = user.phone.validate;
            const invalid = phoneValidator.reduce((acc, item) => {
                const result = validators[item](body.phone, user.phone);
                if (result) {
                    acc = typeof acc === 'object' ? acc : {};
                    acc[item] = result;
                }
                return acc;
            }, false);

            if (invalid) {
                reject({ status: 400, errors: { phone: invalid } });
            } else {
                dataLib.read('users', phone)
                    .then(result => resolve({ status: 200, result }))
                    .catch(errors => reject({ status: 404, errors }));
            }
        });
    },
    DELETE() {
        return new Promise((resolve, reject) => {

        });
    },
};

module.exports = (req, res) => {
    const { method } = req;
    if (acceptableMethods.includes(method)) {
        handlers[method](req)
            .then(({ status, result }) => {
                res.writeHead(status);
                res.end(JSON.stringify(result));
            }).catch(({ status, errors }) => {
                res.writeHead(status);
                console.log(errors);
                res.end(JSON.stringify(errors));
            });
    } else {
        res.writeHead(405);
    }
};
