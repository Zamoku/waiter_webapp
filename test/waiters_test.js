const assert = require('assert');
const Waiters = require('../waiters')
const pgPromise = require("pg-promise");
const pgp = pgPromise({})

const ShortUniqueId = require("short-unique-id")
const uid = new ShortUniqueId({ length: 6 });


const connectionString = process.env.DATABASE_URL || 'postgresql://zamoe:zamo123@localhost:5432/waiters_db_test';

const db = pgp(connectionString)


describe('The basic database web app', function () {
    
    
    it('should insert waiters details when registering into the db test', async function () {
        
        const code = uid()

        let waiter = Waiters(db);
        let detailsWaiter = await waiter.addWaiter(
            'Zamoza', 'nomzamo@gmail.com', code
        );

        let detailsWaiter2 = await waiter.addWaiter(
            'Dee', 'nomfundo@gmail.com', code
        );

        let detailsWaiter3 = await waiter.addWaiter(
            'Zamo', 'zamo@gmail.com', code
        );

    });


    // it('should check if the code is correct before logging in the new waiter db test', async function () {


    //     let waiter = Waiters(db);
    //     let detailsWaiter = await waiter.getCode(
    //         'Nomzamo'
    //     );

    //     let detailsWaiter2 = await waiter.getCode(
    //         'Nomfundo'
    //     );
    

    //     assert.deepEqual("{code: 'qgrGkv'}", detailsWaiter2);
    // });


    // it('should be able to show the days the waiter has selected', async function () {

    //     let waiter = Waiters(db);
    //     let getWaiter = await waiter.pickDays("Nomzamo", "Monday")
    //     let getDays = await waiter.keepdaysChecked("Nomzamo", "Monday");

    //     let getDays2 = await waiter.keepdaysChecked("Yonela", "Monday");


    //     assert.equal(true, getDays);
    //     assert.equal(false, getDays2);

    // });
    // it('should bring back selected days of the specific user', async function () {


    //     let waiter = Waiters(db);
    //     let reg = await waiter.selectedDays('Nomzamo');

    //     assert.deepEqual([], reg);

    // });
    
    // it('should be able to update the waiters days', async function () {


    //     let waiter = Waiters(db);
    //     let reg = await waiter.keepdaysChecked('Nomzamo', 'Monday');


    //     assert.equal(true, reg);

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
    // afterEach('Drop all tables', async function () {
    //     //clean the tables after each test run
    //     await db.query("delete from booked_days;");
    //     await db.query("delete from users;");

    // });

});