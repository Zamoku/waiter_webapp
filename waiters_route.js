module.exports = function WaitersRoutes(waiter) {

    async function display(req, res) {
        res.render('index', {
            //  name: req.params.setWaiter,
            waiter_name: await waiter.showWaiter()
        })
    }

    async function add(req, res) {

        let waiter_name = await waiter.addWaiter(req.body.setWaiter)

        res.redirect(`/schedule/${req.body.setWaiter}`)
    }

    async function displayDays(req, res) {
       
         let waiter_name = req.params.setWaiter
      

        if(waiter_name !== "Admin"){

            res.render('schedule', {
                name: waiter_name,
                waiter: await waiter.showDays()
            })
        }
        else{
            res.render('admin', {
                name: waiter_name,
                waiter: await waiter.showforAdmin()
            })
        }

    }
    async function addDays(req, res) {
        
        // console.log(req.params.name)
        // console.log(req.body.days)
          await waiter.pickDays(req.params.name, req.body.days)

          res.redirect(`/schedule/${req.params.name}`)

    }

    async function displayPickedDays(req, res) {
            
        res.render('showDays', {

            schedule : await waiter.selectedDays(req.params.name)
        })

    }

    async function admin_waiterDays(req, res) {
        
        let waiter_name = await waiter.showDaysforAdmin(req.body.setWaiter)
        console.log(waiter_name)

            res.render('showDays', {
                 name: waiter_name,
                days: await waiter.showDaysforAdmin(req.body.setWaiter)
            })
    }

    return {
        add,
        display,
        addDays,
        displayDays,
        displayPickedDays,
        admin_waiterDays
       
        
    }
}