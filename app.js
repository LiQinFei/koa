const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
// const ejs = require('ejs');
const mongoose = require('mongoose')
const router = require('./routes/index')
const path = require('path')
const koaStatic = require('koa-static')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors')
const MongooseStore = require('koa-session-mongoose')
const session = require('koa-session')
// mongoose.Promise = require('bluebird')
// mongoose.connect(dbUrl)
// app.keys = ['some secret key'];

app.keys = ['lqf'];
let init = async () => {
    let dbUrl = 'mongodb://localhost/lqf'
    const connection = await mongoose.connect(dbUrl);
    app.use(session({
        store: new MongooseStore({
            collection: 'appSessions',
            connection: connection,
            expires: 20, // 1 day is the default
            name: 'AppSession'
        })
    }, app))






app.use(views(__dirname + '/app/views'))

app.use(cors())
// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))


// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(` ..... ${ctx.method} ${ctx.url} - ${ms}ms`)
})

//错误检测

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
        ctx.app.emit('error', err, ctx)
    }
});

//router
app.use(router.routes(),router.allowedMethods())


//public
app.use(koaStatic(path.join(__dirname)))

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


}
init()

app.listen(3000)
