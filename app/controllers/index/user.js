const User = require('../../models/user')
const router = require('../../../routes/index')
exports.register = async (ctx,next)=>{
    let _user =ctx.request.body
    let datas = {
        name:_user.name,
        password:_user.pass
    }
     let name = await User.findOne({name:_user.name}).exec()
    if(name) {
        ctx.body = '存在'
    } else {
        let users = new User(datas)
            let user = await users.save()
        console.log(user)
        ctx.body =user
    }
    // console.log(datas)
    // ctx.body = {name:9}
}
exports.loginPage = async (ctx,next)=>{
    await ctx.render('/index/login',{
    })
}
exports.login = async (ctx,next)=>{
    let _user =ctx.request.body
    console.log(_user)
    let datas = {
        name:_user.mobile,
        password:_user.password
    }
    let user =  await User.findOne({name:datas.name}).exec()
    if(!user){
        ctx.body = '账户错误哦'
    }else {
          if(user.comparePassword(datas.password)) {
                ctx.session.user = user
              console.log(ctx.session.user)
              ctx.response.redirect('/edit')
          }
    }
}
exports.exit = async (ctx,next)=>{
          ctx.session.user = null
        ctx.redirect('/login')
    // ctx.response.redirect()
    // return
}

exports.edit = async (ctx)=>{
    await ctx.render('/index/edit',{
    })
}

// midware for user
exports.signinRequired = async(ctx,next) =>{
    var user = ctx.session.user
    if (!user) {
       ctx.response.redirect('/login')
        return
    }
  return next()
}
exports.adminRequired = async(ctx,next)=>{
    var user = ctx.session.user
    if (user.role <= 10) {
       ctx.body = '0'
    }
   return next()
}