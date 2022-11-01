const assert = require('assert');
const Waiters = require('../waiters')
const pgPromise = require("pg-promise");
const pgp = pgPromise({})

const ShortUniqueId = require("short-unique-id")
const uid = new ShortUniqueId({ length: 6 });


const connectionString = process.env.DATABASE_URL || 'postgresql://zamoe:zamo123@localhost:5432/waiters_db_test';

const db = pgp(connectionString)


describe('The basic database web app', function () {

  beforeEach('Drop all tables', async function () {
    //clean the tables after each test run
    await db.query("delete from booked_days;");
    await db.query("delete from users;");

  });

  it('should insert waiters details when registering into the db test', async function () {

    const code = uid()

    let waiter = Waiters(db);

    await waiter.addWaiter(
      'Zamoza', 'nomzamo@gmail.com', code
    );

    await waiter.addWaiter(
      'Dee', 'nomfundo@gmail.com', code
    );

    await waiter.addWaiter(
      'Zamo', 'zamo@gmail.com', code
    );

    let getWaiter = await waiter.findUser("Zamora")
    let getWaiter2 = await waiter.findUser("Dee")
    let getWaiter3 = await waiter.findUser("Zamo")



    assert.deepEqual({ count: '0' }, getWaiter);
    assert.deepEqual({ count: '1' }, getWaiter2);
    assert.deepEqual({ count: '1' }, getWaiter3);


  });


  it('should return true if the days the waiter has selected and false if otherwise', async function () {



    let waiter = Waiters(db);

    const code = uid()

    await waiter.addWaiter(
      'Zamoza', 'nomzamo@gmail.com', code
    );

    await waiter.addWaiter(
      'Dee', 'nomfundo@gmail.com', code
    );

    await waiter.addWaiter(
      'Zamo', 'zamo@gmail.com', code
    );

    await waiter.pickDays("Zamoza", ["Monday", 'Tuesday', 'Wednesday'])


    let getDays = await waiter.keepdaysChecked("Zamoza", "Monday");
    let getDays2 = await waiter.keepdaysChecked("Yonela", "Monday");

    assert.equal(true, getDays);
    assert.deepEqual(false, getDays2);

  });
  it('should bring back selected days of the specific user', async function () {

    const code = uid()

    let waiter = Waiters(db);

    await waiter.addWaiter(
      'Zamoza', 'nomzamo@gmail.com', code
    );

    await waiter.addWaiter(
      'Dee', 'nomfundo@gmail.com', code
    );

    await waiter.addWaiter(
      'Zamo', 'zamo@gmail.com', code
    );

    await waiter.pickDays("Zamoza", ["Monday","Wednesday","Friday", "Tuesday"])
   

    let getWaiter = await waiter.showDaysforAdmin('Tuesday');

    assert.deepEqual([{day: 'Tuesday', name: 'Zamoza'}], getWaiter);

  });


  it('should return names of waiters and the days they have booked', async function () {


    let waiter = Waiters(db);

    const code = uid()

    await waiter.addWaiter(
      'Zamoza', 'nomzamo@gmail.com', code
    );

    await waiter.addWaiter(
      'Dee', 'nomfundo@gmail.com', code
    );

    await waiter.addWaiter(
      'Zamo', 'zamo@gmail.com', code
    );

    await waiter.pickDays("Zamoza", ["Monday","Wednesday","Friday", "Tuesday"])
    await waiter.pickDays("Dee", ["Monday","Wednesday","Friday", "Tuesday"])
   

    let getdetails = await waiter.showDaysforAdmin('Monday');
    let getdetails2 = await waiter.showDaysforAdmin('Tuesday');
    let getdetails3 = await waiter.showDaysforAdmin('Wednesday');


    assert.deepEqual([{day: 'Monday', name: 'Dee'}, {day: 'Monday', name: 'Zamoza'}], getdetails);
    assert.deepEqual([{day: 'Tuesday', name: 'Dee'}, {day: 'Tuesday', name: 'Zamoza'}], getdetails2);
    assert.deepEqual([{day: 'Wednesday', name: 'Dee'}, {day: 'Wednesday', name: 'Zamoza'}], getdetails3);


  });
  it('should be able to delete waiters for specific day', async function () {


    let waiter = Waiters(db);

    const code = uid()

    await waiter.addWaiter(
      'Zamoza', 'nomzamo@gmail.com', code
    );

    await waiter.addWaiter(
      'Dee', 'nomfundo@gmail.com', code
    );

    await waiter.addWaiter(
      'Zamo', 'zamo@gmail.com', code
    );

    await waiter.pickDays("Zamoza", ["Monday","Wednesday","Friday", "Tuesday"])
    await waiter.pickDays("Dee", ["Monday","Wednesday","Friday", "Tuesday"])

    await waiter.deleteWaiterDay('Tuesday');
    

    let getdetails2 = await waiter.showDaysforAdmin('Tuesday');
    let getdetails3 = await waiter.showDaysforAdmin('Wednesday');

    assert.deepEqual([], getdetails2);
    assert.deepEqual([{day: 'Wednesday', name: 'Dee'}, {day: 'Wednesday', name: 'Zamoza'}], getdetails3);


  });

  it('should check if waiter name is in the database', async function () {


    let waiter = Waiters(db);

    const code = uid()

    await waiter.addWaiter(
      'Zamoza', 'nomzamo@gmail.com', code
    );

    await waiter.addWaiter(
      'Dee', 'nomfundo@gmail.com', code
    );

    await waiter.addWaiter(
      'Zamo', 'zamo@gmail.com', code
    );

    let findWaiter = await waiter.findUser('Nomzamo');
    let findWaiter2 = await waiter.findUser('Zamoza');


    assert.deepEqual({ count: '0' }, findWaiter);
    assert.deepEqual({ count: '1' }, findWaiter2);

  });


  it('should return the string "danger" if waiters are more than 3 in a day, "warning" if there is less than 3 and "booked" if there are 3', async function () {


    let waiter = Waiters(db);
    let getColorCode = await waiter.countNames();

    // let getWaiter = await waiter.deletewaiter()
    assert.deepEqual([
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


});