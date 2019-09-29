const { user } = require('./../models');
const dataLib = require('./../lib/data');
const { dataChecker, dataMapper, hash } = require('./../utils');

const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];

const handlers = {
    POST(body) {
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
    GET() {
        return new Promise((resolve, reject) => {

        });
    },
    PUT() {
        return new Promise((resolve, reject) => {

        });
    },
    DELETE() {
        return new Promise((resolve, reject) => {

        });
    },
};

module.exports = (req, res) => {
    const { method, body } = req;
    if (acceptableMethods.includes(method)) {
        handlers[method](body)
            .then(({ status, result }) => {
                res.writeHead(status);
                res.end(JSON.stringify(result));
            }).catch(({ status, errors }) => {
                res.writeHead(status);
                res.end(JSON.stringify(errors));
            });
    } else {
        res.writeHead(405);
    }
};
