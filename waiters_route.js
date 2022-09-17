module.exports = function WaitersRoutes(waiter){
    async function add(req, res){

        await waiter.addWaiter(req.body.setWaiter)
            
    }

    async function display(req, res){
        res.render('index',{
            waiter: await waiter.showWaiter()
        })

    }
    async function addDays(req, res){
        res.render('index',{
            waiter: await waiter.showDays()
        })

    }
    return {
        add,
        display,
        addDays
    }
}