const path = require('path');
const { open, readFile, unlink } = require('fs');

const { handleWriteFile, handleTruncateFile } = require('./helpers');

const baseDir = path.join(__dirname, '/../../.data/');

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
    },
    read(dir, file) {
        return new Promise((resolve, reject) => {
            readFile(`${baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
                if(!err && data) {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } else {
                    reject(err);
                }
            });
        });
    },
    update(dir, file, data) {
        return new Promise((resolve, reject) => {
            open(`${baseDir}${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
                if(!error && fileDescriptor) {
                    handleTruncateFile(data, fileDescriptor)
                        .then(TruncatingRes =>  resolve(TruncatingRes))
                        .catch(TruncatingError => reject(TruncatingError));
                } else {
                    reject('could not open the file for updating, it may not exist yet');
                }
            });
        });
    },
    delete(dir, file) {
        return new Promise((resolve, reject) => {
            unlink(`${baseDir}${dir}/${file}.json`, (error) => {
                if(error) {
                    reject('could not delete the file, it may not exist yet');
                } else {
                    resolve(`file with name "${file}" been deleted`);
                }
            });
        });
    }
};

module.exports = lib;