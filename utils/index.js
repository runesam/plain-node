const crypto = require('crypto');

const configuration = require('./../config');
const validators = require('./validators');

const dataChecker = (data, model) => {
    const keys = Object.keys(model);
    for(let i = 0; i < keys.length; i++) {
        if (model[keys[i]].required && !data[keys[i]]) {
            return {
                error: 'missing property',
                content: keys[i],
            };
        }
        if (data[keys[i]]) {
            const input = data[keys[i]];
            const inputModel = model[keys[i]];

            const validateResult = model[keys[i]].validate.reduce((acc, validator) => {
                const invalid = validators[validator](input, inputModel);
                if (invalid) {
                    acc.push({ [validator]: invalid });
                    return acc;
                }
                return acc;
            }, []);
            
            if (validateResult.length) {
                return { [keys[i]]: validateResult };
            }
        } 
    }
    return false;
};

const dataMapper = (data, model) => {
    const modelKeys = Object.keys(model);
    return Object.keys(data).reduce((acc, item) => {
        if (modelKeys.includes(item)) {
            acc[item] = data[item];
        }
        return acc;
    }, {});
};

const hash = (password) => {
    return crypto.createHmac('sha256', configuration.hashSecret)
        .update(password)
        .digest('hex');
};

module.exports = {
    hash,
    dataMapper,
    validators,
    dataChecker,
};
