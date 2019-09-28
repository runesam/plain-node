const fs = require('fs');

const {
    close,
    ftruncate,
    writeFile,
} = fs;

const handleWriteFile = (data, fileDescriptor) => new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data);
    writeFile(fileDescriptor, dataString, (writeError) => {
        if (!writeError) {
            close(fileDescriptor, (closeError) => {
                if (closeError) {
                    reject('Error closing file');
                } else {
                    resolve(data);
                }
            });
        } else {
            reject('Error writing to file');
        }
    });
});

const handleTruncateFile = (data, fileDescriptor) => new Promise((resolve, reject) => {
    ftruncate(fileDescriptor, (truncateError) => {
        if (truncateError) {
            reject('failed to truncate the file');
        } else {
            handleWriteFile(data, fileDescriptor)
                .then(res => resolve(res))
                .catch(reason => reject(reason));
        }
    });
});

module.exports = {
    handleWriteFile,
    handleTruncateFile,
};
