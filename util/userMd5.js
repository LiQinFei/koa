
const md5=require('md5')

exports.encrypt = function (val) {
    return md5(md5(val+'lqf'))
}
