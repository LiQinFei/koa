const mongoose = require('mongoose')
const encrypt = require('../../util/userMd5')
const UserSchema =  mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:String,
    //0 nomal admin
    //1 verified admin
    role:{
        type:Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }

})

UserSchema.pre('save',function (next) {

    let _this = this
    if(this.isNew){
        this.meta.createAt= this.meta.updateAt = Date.now()
    }else {
        this.meta.updateAt = Date.now()
    }

    this.password = encrypt.encrypt(_this.password)
    next()
})

UserSchema.methods = {
    comparePassword:function (_password) {
      return (encrypt.encrypt(_password) === this.password)
    }
}

UserSchema.statics = {
    fetch:function () {
        return this.find({}).sort('meta.updateAt').exec()
    },
    findById:function (id) {
        return this.findOne({_id:id}).exec()
    }
}
module.exports = UserSchema



