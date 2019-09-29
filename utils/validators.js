const validators = {
    value(input, { value }) {
        if (input === value) {
            return false;
        }
        return `should has a value of ${value}, received value is ${input}`;
    },
    type(input, { type }) {
        if (typeof input === type) {
            return false;
        }
        return `should be type of ${type}, received type of ${typeof input}`;
    },
    length(input, { length }) {
        if (input.length === length) {
            return false;
        }
        return `should has length of ${length}, received length of ${input.length}`;
    },
    minLength(input, { minLength }) {
        if (input.length >= minLength) {
            return false;
        }
        return `should has minLength of ${minLength}, received length of ${input.length}`;
    },
};

module.exports = validators;
