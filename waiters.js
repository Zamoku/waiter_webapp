module.exports = function Waiters(db) {

    let results = ''

    async function addWaiter(name) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
        let regex = /^[a-z A-Z]+$/gi
        let results = await db.manyOrNone('SELECT name FROM users where name = $1', [waiters_name])

        if (results.length == 0 && waiters_name !== "" && regex && regex.test(waiters_name)) {

            results = await db.manyOrNone("INSERT INTO users(name) VALUES ($1) returning name", [waiters_name])
        }
        // else{

        //     results = await db.manyOrNone('SELECT distinct name FROM users where name = $1', [waiters_name])
        // }
        // console.log(results)
        return results
    }

    async function showWaiter() {
        // let results = await db.manyOrNone('SELECT name FROM users')
        results = await db.manyOrNone('SELECT name FROM users order by id desc Limit 1')


        return results
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

    async function pickDays(name, days) {
  
        let arrayName = [name]
        let dd = Array.isArray(days) === false ? [days] : days

        for (let day of dd) {
        
                let resultName = await db.one('Select users.id from users where users.name = $1; ',[name])
                let resultDay = await db.oneOrNone('Select days.id from days where days.day = $1',[day])
              
           
                let results = await db.none("INSERT INTO booked_days(name_id, booked_day_id) VALUES ($1,$2)",[resultName.id,resultDay.id])

            }
        
    }

    async function selectedDays(name) {
        let results = await db.manyOrNone("SELECT users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where users.name = $1", [name]);
        // console.log(results)
        return results
    }

    async function showforAdmin() {
        let results = await db.manyOrNone("SELECT distinct users.name from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id");
        // console.log(results)
        return results
    }

    async function showDaysforAdmin(name) {
        let results = await db.manyOrNone("SELECT users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where users.name = $1", [name]);
        console.log(results)
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
        showDaysforAdmin
    }
}