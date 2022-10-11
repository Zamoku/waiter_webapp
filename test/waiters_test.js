const assert = require('assert');
const Waiters = require('../waiters')
const pgPromise = require("pg-promise");
const pgp = pgPromise({})

const connectionString = process.env.DATABASE_URL || 'postgresql://zamoe:zamo123@localhost:5432/waiters_db_test';

const db = pgp(connectionString)


describe('The basic database web app', function () {


    it('should insert waiters details when registering into the db test', async function () {


        let waiter = Waiters(db);
        let detailsWaiter = await waiter.addWaiter(
            'Nomzamo', 'nomzamo@gmail.com'
        );

        let detailsWaiter2 = await waiter.addReg(
            'Nomfundo', 'nomfundo@gmail.com'
        );
    

    });


    it('should display the waiters schedule from the db test', async function () {

        let waiter = Waiters(db);
        let getWaiter = await waiter.displayWaiter()
        assert.deepEqual([{name: "Nomzamo", email: "nomzamo@gmail.com"}, {name: "Nomfundo", email: "nomfundo@gmail.com"}], getWaiter);
        

    });
    it('should get filter working shifts by name numbers from the db test', async function () {


        let waiter = Waiters(db);
        let reg = await waiter.filterWaiter('Nomzamo');


        assert.equal([{day: "Wednesday", shiftType: "night shift"}, {day: "Thursday", shiftType: "day shift"}], reg);

    });
    
    // it('should get filter working shifts by day numbers from the db test', async function () {


    //     let waiter = Waiters(db);
    //     let reg = await waiter.filterReg('CY');


    //     assert.equal("CY 254-562", "CY 254-562", reg);

    // });

    // it('should get filter waiter numbers from Paarl the db test', async function () {


    //     let waiter = Waiters(db);
    //     let reg = await waiter.filterReg('CJ');


    //     assert.equal("CJ 254-562", "CJ 254-562", reg);

    // });

    // it('should get filter waiter numbers from Cape Town the db test', async function () {


    //     let waiter = Waiters(db);
    //     let reg = await waiter.filterReg('CA');


    //     assert.equal("CA 254-562", "CA 254-562", reg);

    // });

    
    // it('should clear the list of waiter numbers in the db test and bring back a success message', async function () {


    //     let waiter = Waiters(db);
    //     await waiter.deleteReg();

    //     let getWaiter = await waiter.deleteReg()
    //     assert.equal(undefined, getReg);
    // });
    afterEach('Drop all tables', async function () {
        //clean the tables after each test run
        await db.query("delete from booked_days;");
        await db.query("delete from users;");

    });

});