const fs = require("fs");
const path = require("path");

class Explorer {

    get path() {
        return this.dir;
    }

    async setPath(dirPath) {
        this.dir = path.resolve(dirPath);
        await this._setDirectoryContext(this.dir);
    }

    get fileCount() {
        return this.files.length;
    }

    getFilenameAt(idx) {
        return this.files[idx];
    }

    contains(filename) {
        return this.files.includes(filename);
    }

    move(filename, newDir) {
        const oldPath = path.resolve(this.path, filename);
        const newPath = path.resolve(newDir, filename);
        return new Promise((res, rej) => {
            fs.rename(oldPath, newPath, err => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    }

    _setDirectoryContext(path) {
        return new Promise((res, rej) => {
            fs.readdir(this.dir, (err, files) => {
                if (err) {
                    rej(err);
                } else {
                    this.files = files;
                    res();
                }
            })
        });
    }
}

module.exports = { Explorer }