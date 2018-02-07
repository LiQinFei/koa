 const router =  require('koa-router')()
 const Index = require('../app/controllers/index/index')
 const User = require('../app/controllers/index/user')



 router.post('/index',Index.index)


 //用户
 router.post('/register',User.register)
 router.post('/login',User.login)
 router.get('/login',User.loginPage)

 router.get('/edit',User.signinRequired,User.edit)
 router.get('/exit',User.exit)


 module.exports = router
