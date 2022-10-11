module.exports = function Waiters(db) {

    let results = ''

    async function addWaiter(name, email, code) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
        let regex = /^[a-z A-Z]+$/gi
        let results = await db.manyOrNone('SELECT name FROM users where name = $1', [waiters_name])

        if (results.length == 0 && waiters_name !== "" && regex && regex.test(waiters_name)) {

            results = await db.manyOrNone("INSERT INTO users(name, email, code) VALUES ($1,$2,$3) returning name", [waiters_name, email, code])
        }

        return results
    }

    async function showWaiter() {
        results = await db.manyOrNone('SELECT name FROM users order by id desc Limit 1')


        return results
    }

    async function findUser(name) {


        let result = await db.one("Select count(*) from users where name = $1", [name])

        return result
    }

    async function getCode(name) {

        let uniq_code = await db.one("Select code from users where name = $1", [name])

        return uniq_code

    }

    async function showAll() {
        let results = await db.manyOrNone("SELECT * from users Inner Join days on Days.id = users.booked_day_id");

        return results
    }

    async function removeAll() {
        let results = await db.none("DELETE FROM users");

    }

    async function showDays() {
        let results = await db.manyOrNone("SELECT days FROM days");

        return results

    }
    async function checkDaysBooked(name) {
        let results = await db.manyOrNone("Select * from booked_days where name = $1", [name])

        return results
    }

    async function pickDays(name, days) {

        let arrayName = [name]
        let dd = Array.isArray(days) === false ? [days] : days

        let resultName = await db.one('Select users.id from users where users.name = $1; ', [name])
        let getBookedUser = await db.oneOrNone(`SELECT name_id FROM booked_days where name_id = $1 limit 1`, [resultName.id])
        let getBookedDay = await db.manyOrNone(`SELECT booked_day_id FROM booked_days where name_id = $1 limit 3`, [resultName.id])

        for (let day of dd) {
            let resultDay = await db.oneOrNone('Select days.id from days where days.day = $1', [day])
        
            
            if  (getBookedDay == null && getBookedUser == null) {

                let results = await db.none("INSERT INTO booked_days(name_id, booked_day_id) VALUES ($1,$2)", [resultName.id, resultDay.id])

            }
                //  else if (getBookedUser.name_id !== resultName.id && getBookedDay !== resultDay.id) {

                    // let results = await db.none("INSERT INTO booked_days(name_id, booked_day_id) VALUES ($1,$2)", [resultName.id, resultDay.id])
                //  }

        }

    }

    async function removeDays() {
        let results = await db.none("Delete from booked_days")

    }

    async function getDays() {
        let results = await db.manyOrNone("Select * from days")

        return results
    }


    // async function selectedDays(name) {
    //     let results = await db.manyOrNone("SELECT days.day, STRING_AGG(users.name,'\n') from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id group by days.day, days.id order by days.id asc", [name]);

    //     return results
    // }

    async function showforAdmin() {
        let results = await db.manyOrNone("SELECT distinct days.day, users.name from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id");

        return results
    }



    async function showDaysforAdmin(weekDay) {
        let results = await db.manyOrNone("SELECT users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where days.day = $1", [weekDay]);
        // console.log(results)
        return results
    }

    async function selectedDays(name) {
        let results = await db.manyOrNone("SELECT users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where days.day = $1", [name]);
        // console.log(results)
        return results
    }


    return {
        addWaiter,
        showWaiter,
        showAll,
        removeAll,
        showDays,
        pickDays,
        selectedDays,
        showforAdmin,
        showDaysforAdmin,
        checkDaysBooked,
        removeDays,
        findUser,
        getCode,
        getDays
    }
}