module.exports = function Waiters(db){

    async function addWaiter(name, booked_id){
        let results = await db.none("INSERT INTO users(name, booked_day_id) VALUES ($1,(SELECT Days.id FROM Days WHERE day = $2));",[name, booked_id])
        
    }

    async function showWaiter(){
        let results = await db.manyOrNone("SELECT name from users")

        return results
    }

    async function showAll(){
        let results = await db.manyOrNone("SELECT * from users Inner Join days on Days.id = users.booked_day_id");

        return results
    }

    async function removeAll(){
        let results = await db.none("DELETE FROM users");

    }

    async function showDays(){

    }
    return{
        addWaiter,
        showWaiter,
        showAll,
        removeAll
    }
}