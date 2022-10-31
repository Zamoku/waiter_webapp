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


    it('should check if the code is correct before logging in the new waiter db test', async function () {


        let waiter = Waiters(db);
        let detailsWaiter = await waiter.getCode(
            'Zamoza'
        );

        let detailsWaiter2 = await waiter.getCode(
            'Zamo'
        );
    
    });


    it('should be able to show the days the waiter has selected', async function () {

        let waiter = Waiters(db);
         let getWaiter = await waiter.pickDays("Zamoza", "Monday")
        
        let getDays = await waiter.keepdaysChecked("Zamoza", "Monday");

         let getDays2 = await waiter.keepdaysChecked("Yonela", "Monday");


        assert.equal(true, getDays);
         assert.equal(false, getDays2);

    });
    it('should bring back selected days of the specific user', async function () {


        let waiter = Waiters(db);
        let reg = await waiter.selectedDays('Zamoza');

        assert.deepEqual([], reg);

    });
    
    
    it('should return names of waiters and the days they have booked', async function () {
        
        
        let waiter = Waiters(db);
        let getdetails = await waiter.showDaysforAdmin('Monday');
        
        let getdetails2 = await waiter.showDaysforAdmin('Tuesday');
        
        
        assert.deepEqual([ { name: 'Zamoza', day: 'Monday' } ], getdetails);
        assert.deepEqual([], getdetails2);
        
        
    });
    it('should be able to delete waiters for specific day', async function () {


        let waiter = Waiters(db);
        let reg = await waiter.deleteWaiterDay('Tuesday');


        assert.equal(undefined, reg);

    });

    it('should get waiter name from database', async function () {


        let waiter = Waiters(db);
        let reg = await waiter.findUser('Nomzamo');
        let reg2 = await waiter.findUser('Zamoza');


        assert.deepEqual({ count: '0' }, reg);
        assert.deepEqual({ count: '1' }, reg2);

    });

    
    it('should return the string "danger" if waiters are more than 3 in a day, "warning" if there is less than 3 and "booked" if there are 3', async function () {


        let waiter = Waiters(db);
        let getColorCode = await waiter.countNames();

        // let getWaiter = await waiter.deleteReg()
        assert.equal([
            {
              color: 'warning',
              day: 'Monday',
              id: 1
            },
            {
              color: 'warning',
              day: 'Tuesday',
              id: 2
            },
            {
              color: 'warning',
              day: 'Wednesday',
              id: 3
            },
            {
              color: 'warning',
              day: 'Thursday',
              id: 4
            },
            {
              color: 'warning',
              day: 'Friday',
              id: 5
            },
            {
              color: 'warning',
              day: 'Saturday',
              id: 6
            },
            {
              color: 'warning',
              day: 'Sunday',
              id: 7
            }
          ], getColorCode);
    });

    

    before('Drop all tables', async function () {
        //clean the tables after each test run
        await db.query("delete from booked_days;");
        await db.query("delete from users;");

    });

});