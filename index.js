const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const Waiters = require('./waiters');
const WaitersRoutes = require('./waiters_route');
const WaitersFunct = require('./waiters_non_db');


const pgPromise = require("pg-promise")
const pgp = pgPromise({})

// SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://zamoe:zamo123@localhost:5432/waiters_db';

const db = pgp({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const waiter = Waiters(db)
const waiterFunct = WaitersRoutes()
const waiterRoute = WaitersRoutes(waiter, waiterFunct)

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
 app.use(bodyParser.json());

 app.use(session({
    secret: "my reg secret",
    cookie: {
        maxAge: 1000 * 36000
      },
    resave: false,
    saveUninitialized: true
}));

 app.use(flash());

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// app.get('/', waiterRoute.displayLogin);
app.get('/', waiterRoute.displayReg);
app.post('/', waiterRoute.addUser);
app.get('/login/:name', waiterRoute.displayLogin);
app.post('/login/:name', waiterRoute.addCode);
app.get('/schedule/:setWaiter', waiterRoute.displayDays);
app.post('/schedule/:name', waiterRoute.addDays);
app.get('/resetDay/:day', waiterRoute.removeWaiterDay);
app.get('/days', waiterRoute.displayForAdmin); 
app.get('/reset', waiterRoute.removeWaiters);

const PORT = process.env.PORT || 3003

app.listen(PORT, function() {
    console.log('App started at port:', PORT)

})