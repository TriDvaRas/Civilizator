
var fs = require('fs');
module.exports = {
    Read: function Read(Path) {
        var data = fs.readFileSync(Path, "utf8");
        
        return JSON.parse(data);
    },
    Write: function Write(Path, data) {
        fs.writeFileSync(Path, JSON.stringify(data, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}