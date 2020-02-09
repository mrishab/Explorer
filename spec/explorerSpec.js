const { Explorer } = require("../src/explorer");
const { resolve } = require("path");

const fs = require("fs");

describe("Explorer Spec", () => {

    let explorer;

    beforeEach(() => {
        explorer = new Explorer();
    });

    it("setPath sets the context explorer to the provided directory", async done => {
        spyOn(fs, 'readdir').and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, []);
        });

        await explorer.setPath("/path/to/dir");

        expect(explorer.path).toBe(resolve("/path/to/dir"));
        done();
    });

    it("setPath throws error when directory couldn't be read", async done => {
        spyOn(fs, 'readdir').and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(new Error("Invalid directory: /path/to/dir"), undefined);
        });

        await expectAsync(explorer.setPath("/path/to/dir")).toBeRejectedWithError("Invalid directory: /path/to/dir");
        done();
    });

    it("fileCount returns 0 when no files are present in the dir", async done => {
        spyOn(fs, 'readdir').and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, []);
        });

        await explorer.setPath("/path/to/dir");

        expect(explorer.fileCount).toBe(0);
        done();
    });

    it("fileCount returns number of files present in the dir", async done => {
        spyOn(fs, 'readdir').and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, ["file1", "file2"]);
        });

        await explorer.setPath("/path/to/dir");

        expect(explorer.fileCount).toBe(2);
        done();
    });

    it("getFilenameAt returns the name of the file at the specified index", async done => {
        spyOn(fs, 'readdir').and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, ["file1", "file2", "file3", "file4"]);
        });

        await explorer.setPath("/path/to/dir");

        expect(explorer.getFilenameAt(0)).toBe("file1");
        expect(explorer.getFilenameAt(1)).toBe("file2");
        expect(explorer.getFilenameAt(2)).toBe("file3");
        expect(explorer.getFilenameAt(3)).toBe("file4");

        done();
    });

    it("contains returns true/false whether a given filename exists or not in the folder", async done => {
        spyOn(fs, 'readdir').and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, ["file1", "file2", "file3", "file4"]);
        });

        await explorer.setPath("/path/to/dir");

        expect(explorer.contains("file0")).toBe(false);
        expect(explorer.contains("file1")).toBe(true);
        expect(explorer.contains("file2")).toBe(true);
        expect(explorer.contains("file3")).toBe(true);
        expect(explorer.contains("file4")).toBe(true);
        expect(explorer.contains("file5")).toBe(false);

        done();
    });

    it("move moves the given file in the directory to specified parent directory", async done => {
        spyOn(fs, 'rename').and.callFake((oldPath, newPath, callback) => {
            expect(oldPath).toBe(resolve("/path/to/dir/file3"));
            expect(newPath).toBe(resolve("/some/other/path/file3"));
            callback(undefined);
        });

        const fsSpy = spyOn(fs, 'readdir');
        fsSpy.and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, ["file1", "file2", "file3", "file4"]);
        });

        await explorer.setPath("/path/to/dir");
        await explorer.move("file3", "/some/other/path");

        expect(fs.rename).toHaveBeenCalledTimes(1);

        done();
    });

    it("move throws an error if file doesn't exist in the directory", async done => {
        spyOn(fs, 'rename').and.callFake((oldPath, newPath, callback) => {
            expect(oldPath).toBe(resolve("/path/to/dir/file3"));
            expect(newPath).toBe(resolve("/some/other/path/file3"));
            callback(new Error("No such file: /path/to/dir/file3"));
        });

        // Pre-check
        const fsSpy = spyOn(fs, 'readdir');
        fsSpy.and.callFake((path, callback) => {
            expect(path).toBe(resolve("/path/to/dir"));
            callback(undefined, ["file1", "file2", "file4"]);
        });

        await explorer.setPath("/path/to/dir");

        await expectAsync(explorer.move("file3", "/some/other/path")).toBeRejectedWithError("No such file: /path/to/dir/file3");
        expect(fs.rename).toHaveBeenCalledTimes(1);

        done();
    });
});