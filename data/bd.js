const fs = require('fs');

getData=(filename)=>{
    const data = fs.readFileSync(__dirname +"/"+filename,{ encoding: 'utf8', flag: 'r' });
    return JSON.parse(data)
}

module.exports = { getData }