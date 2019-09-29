const userModel = {
    firstName: {
        minLength: 5,
        type: 'string',
        required: true,
        validate: ['type', 'minLength'],
    },
    lastName: {
        minLength: 5,
        type: 'string',
        required: true,
        validate: ['type', 'minLength'],
    },
    phone: {
        length: 10,
        type: 'string',
        required: true,
        validate: ['type', 'length'],
    },
    password: {
        minLength: 8,
        type: 'string',
        required: true,
        validate: ['type', 'minLength'],
    },
    TOSAgreement: {
        value: true,
        required: true,
        type: 'boolean',
        validate: ['type', 'value'],
    },
};

module.exports = userModel;
