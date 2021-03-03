
var fs = require('fs');
module.exports = {
    Read: function Read(Path) {
        var data = fs.readFileSync(Path, "utf8");

        return JSON.parse(data);
    },
    Write: function Write(Path, data) {
        fs.writeFileSync(Path, JSON.stringify(data, null, 2), function (err) {
            if (err) {
                logger.log(`error`, `${err}`);
            }
        });
    },
    createDir(path) {
        fs.mkdirSync(path, { recursive: true }, function (err) {
            if (err) {
                logger.log(`error`, `${err}`);
            }
        });
    },
    removeDir(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            }, function (err) {
                if (err) {
                    logger.log(`error`, `${err}`);
                }
            });
            fs.rmdirSync(path);
        }
    }
}