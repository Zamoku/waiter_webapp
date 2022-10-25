module.exports = function Waiters(db) {

    let results = ''
/*
 Gets current names from the database if name is there in not the database then
 Adds the name, email and unique code of the waiter when registers the first time
  */
    async function addWaiter(name, email, code) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
        let regex = /^[a-z A-Z]+$/gi
        let results = await db.manyOrNone('SELECT name FROM users where name = $1', [waiters_name])

        if (results.length == 0 && waiters_name !== "" && regex && regex.test(waiters_name)) {

            results = await db.manyOrNone("INSERT INTO users(name, email, code) VALUES ($1,$2,$3) returning name", [waiters_name, email, code])
        }

        return results
    }

   /*Gets the number the user appears in the database */
    async function findUser(name) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
        let result = await db.one("Select count(*) from users where name = $1", [waiters_name])

        return result
    }

    /*Gets the code from the users(waiters) table */

    async function getCode(name) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
        let uniq_code = await db.one("Select code from users where name = $1", [waiters_name])

        return uniq_code

    }

    /*  */
    // async function showAllDays() {
    //     let results = await db.manyOrNone("SELECT * from users Inner Join days on Days.id = users.booked_day_id");

    //     return results
    // }

    /*Resets the data from the users(waiters) table*/
    async function removeAll() {
        let results = await db.none("DELETE FROM users");

    }

    /* Shows the name of the days for the table days */
    async function showDays() {
        let results = await db.manyOrNone("SELECT day FROM days");

        return results

    }
    /* */
    // async function checkDaysBooked(name) {
    //     let results = await db.manyOrNone("Select * from booked_days where name = $1", [name])

    //     return results
    // }

    /*This function gets the users ids and if it gets them it deletes them before adding new data*/
    async function pickDays(name, days) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);

        let dd = Array.isArray(days) === false ? [days] : days
     
        let resultName = await db.one('Select users.id from users where users.name = $1; ', [waiters_name])

        await db.none("Delete from booked_days where name_id = $1", [resultName.id])
       
        for (let day of dd) {
          
            let resultDay = await db.oneOrNone('Select days.id from days where days.day = $1', [day])
        
            
                if(resultDay !== null){

                    let results = await db.query("INSERT INTO booked_days(name_id, booked_day_id) VALUES ($1,$2)", [resultName.id, resultDay.id])
                }

           
        }

    }

    /*Checks if the days are checked if true then keep them checked */
    async function keepdaysChecked(name, day){
   
        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
      
            let result = await db.manyOrNone("SELECT users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where users.name = $1 and days.day = $2", [waiters_name, day])
            // console.log(result)
            checked = result.length > 0 ? true : false

             return checked

    }

    /*This function gets all the days from the table days */
    async function getDays() {
        let results = await db.manyOrNone("Select * from days")

        return results
    }

    /*This function counts the number of waiters from each day
    if they are more than three assign a string danger
    if names are equal to three assign a string booked
    if the names are less than 3 assign a string warning*/
    async function countNames(){
        const weekDay = await getDays()
         
        for(let day of weekDay){
            
            let result = await db.oneOrNone("Select count(*) from booked_days where booked_day_id = $1", [day.id])
          
            const count = Number(result.count);
            
         
    
                    if(count > 3){
                        day.color = "danger"
                    }
                    else if(count === 3){
                        day.color = "booked"
                    }
                    else if(count < 3){
                        day.color = "warning"
                    }
    
                }
          return weekDay
     }

     /*Removes all data from the booked_days table which include the days id's picked by specific user*/
    async function removeDays() {
        let results = await db.none("Delete from booked_days")

    }

    /*The function selects users */
    // async function showforAdmin() {
    //     let results = await db.manyOrNone("SELECT distinct days.day, users.name from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id");

    //     return results
    // }
    /*The function deletes waiters by day */
    async function deleteWaiterDay(day) {
        let getbookedDayId = await db.one("SELECT id from days where day = $1", [day])
        let results = await db.none("Delete from booked_days where booked_day_id = $1;", [getbookedDayId.id]);
    
    }

    /*Displays names of waiters and the days they have booked*/
    async function showDaysforAdmin(weekDay) {
        let results = await db.manyOrNone("SELECT distinct users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where days.day = $1", [weekDay]);
     
        return results
    }
    /* */
    async function selectedDays(name) {

        let waiters_name = name.charAt(0).toUpperCase() + name.slice(1);
        
        let results = await db.manyOrNone("SELECT users.name, days.day from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where days.day = $1", [waiters_name]);
        // console.log(results)
        return results
    }


    return {
        addWaiter,
        removeAll,
        showDays,
        pickDays,
        selectedDays,
        showDaysforAdmin,
        removeDays,
        findUser,
        getCode,
        getDays,
        countNames,
        deleteWaiterDay,
        keepdaysChecked
    }
}