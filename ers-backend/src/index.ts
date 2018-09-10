import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import { reimbursementRouter } from './routers/reimbursement-router';
import { userRouter } from './routers/user-router';

const app=express();

const port=8888;

app.set('port', port);

const sess= {
    secret: 'keyboard cat',
    cookie: {secure: false},
    resave: false,
    saveUninitialized: false
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));

// logging
app.use((req, resp, next) => {
    console.log(`request made with path: ${req.path} and type: ${req.method}`);
    next();
})

app.use(bodyParser.json({limit: '16mb'}))


app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Origin", `http://localhost:3000`);
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    resp.header("Access-Control-Allow-Credentials", "true");
    resp.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
})

app.use('/reimbursements', reimbursementRouter);
app.use('/users', userRouter);

const server = app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});