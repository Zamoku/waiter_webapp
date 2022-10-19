module.exports = function WaitersRoutes(waiter) {

    const ShortUniqueId = require("short-unique-id")
    const uid = new ShortUniqueId({ length: 6 });

    async function displayReg(req, res) {
        // let user = req.body.user

        res.render('register', {
            // user: req.body.user,


        })

    }


    async function addUser(req, res) {

        let regex = /^[a-z A-Z]+$/gi
        let name = req.body.setWaiter
        let email = req.body.email
        // name = req.session.
        const code = uid()

        const get_user = await waiter.findUser(name)

        if (get_user.count == 1) {

            req.flash('welcomeback','Hi, ' + name + ' Welcome back!')

            res.redirect("/schedule/" + name)
        }
        else if (!regex.test(name)) {

            req.flash('error', 'Oops, your name seems to have characters..check and enter again')

            res.redirect("/")
        }


        else if (name, email == "") {
            req.flash('error', 'No user or email provided')

            res.redirect("/")
        }
        else {

            let waiter_name = await waiter.addWaiter(name, email, code)


            req.flash('success', 'You have succesfully registered, your code is: ' + code)

            // res.redirect("/login/"+ name)
            res.redirect(`/login/${req.body.setWaiter}`)

        }

    }

    async function displayLogin(req, res) {
        // let user = req.session.user
        var username = req.params.name
        res.render('login', {
            // user: req.session.user,
            username: username
        })

    }

    async function addCode(req, res) {
        let {addCode } = req.body
        let user = req.params.name
        let getCode = await waiter.getCode(user)
        


        if (getCode.code === addCode) {
            req.flash('success', 'You have loged in succesfully')

            res.redirect("/schedule/" + user)

        } else if (getCode.code !== addCode) {


            req.flash('error', 'ENTER THE CORRECT CODE GIVEN!')

            res.redirect("/login/" + user)
        }
    }



    async function displayDays(req, res) {

        let waiter_name = req.params.setWaiter
        let waiter_days = req.body.days
        let getDays = await waiter.countNames()
       
        


        if (waiter_name !== "Admin") {

            // req.flash('success', 'Welcome!')
            res.render('schedule', {
                name: waiter_name,
                waiter: await waiter.showDays(),
                // should be checked
                monday: await waiter.keepdaysChecked(waiter_name, "Monday"),
                tuesday: await waiter.keepdaysChecked(waiter_name, "Tuesday"),
                wednesday: await waiter.keepdaysChecked(waiter_name, "Wednesday"),
                thursday: await waiter.keepdaysChecked(waiter_name, 'Thursday'),
                friday: await waiter.keepdaysChecked(waiter_name, "Friday"),
                saturday: await waiter.keepdaysChecked(waiter_name, "Saturday"),
                sunday: await waiter.keepdaysChecked(waiter_name, "Sunday"),
            })
        }
        else {
            // req.flash('success', 'Welcome!')
            res.render('showDays', {
                name: waiter_name,
                getDay: waiter_days,
                getDays: await waiter.countNames(),
        
               
                monday: await waiter.showDaysforAdmin("Monday"),
                tuesday: await waiter.showDaysforAdmin("Tuesday"),
                wednesday: await waiter.showDaysforAdmin("Wednesday"),
                thursday: await waiter.showDaysforAdmin('Thursday'),
                friday: await waiter.showDaysforAdmin("Friday"),
                saturday: await waiter.showDaysforAdmin("Saturday"),
                sunday: await waiter.showDaysforAdmin("Sunday"),
                
                
                
            })
        }
        
    }
    async function addDays(req, res) {
        
        
        req.flash('success', 'You have succesfully added your working days!')
        
        //  if()
        await waiter.pickDays(req.params.name, req.body.days)
    
    
    
        res.redirect(`/schedule/${req.params.name}`)

    }

   

    async function removeWaiters(req, res) {
        let waiter_name = req.params.name

        
        req.flash('success', 'You have reseted the schedule')
     

        res.redirect('/reset')

    }

    async function removeWaiterDay(req, res){

        
        let waiter_day = req.params.day

         req.flash('success', 'You have removed the waiters for this day')
         await waiter.deleteWaiterDay(waiter_day)

        res.redirect('/schedule/Admin')
    }
   
    async function displayPickedDays(req, res) {

        let waiter_name = await waiter.selectedDays(req.body.setWaiter)
            

        res.render('admin', {
            name: waiter_name,
            days: await waiter.selectedDays(req.body.setWaiter)
        })
    }

    return {
        addUser,
        displayLogin,
        addDays,
        displayDays,
        displayPickedDays,
        removeWaiters,
        displayReg,
        addCode,
        removeWaiterDay,
        // getCheckedDays
        // admin_waiterDays


    }
}