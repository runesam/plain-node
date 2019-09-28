const fs = require('fs');
const path = require('path');

const {
    open,
    close,
    writeFile,
} = fs;

const baseDir = path.join(__dirname, '/../.data/');

const handleWriteFile = (data, fileDescriptor) => new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data);
    writeFile(fileDescriptor, dataString, (writeError) => {
        if (!writeError) {
            close(fileDescriptor, (closeError) => {
                if (closeError) {
                    reject('Error closing new file');
                } else {
                    resolve(data);
                }
            });
        } else {
            reject('Error writing to new file');
        }
    });
});

const lib = {
    create(dir, file, data) {
        return new Promise((resolve, reject) => {
            open(`${baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
                if(!err && fileDescriptor) {
                    handleWriteFile(data, fileDescriptor)
                        .then(writingFileRes =>  resolve(writingFileRes))
                        .catch(writingFileError => reject(writingFileError));
                } else {
                    reject('could not create a new file, it may already exists');
                }
            });
        });
    }
};

module.exports = lib;