module.exports = function WaitersRoutes(waiter, db) {

    const ShortUniqueId = require("short-unique-id")
    const uid = new ShortUniqueId({ length: 6 });

    async function displayRegPage(req, res) {

        res.render('register', {

        })

    }


    async function addUser(req, res) {
        let regex = /^[a-z A-Z]+$/gi
        let name = req.body.setWaiter
        let waitername = name.charAt(0).toUpperCase() + name.slice(1);
        let email = req.body.email
        const code = uid()

        
        const get_user = await waiter.findUser(name)


        if (get_user.count == 1) {

            req.flash('welcomeback','Hi, ' + waitername + ' Welcome back!')

            res.redirect("/schedule/" + waitername)
        }
        else if (!regex.test(waitername)) {

            req.flash('error', 'Oops, your name seems to have characters..check and enter again')

            res.redirect("/")
        }


        else if (name, email == "") {
            req.flash('error', 'No user or email provided')

            res.redirect("/")
        }
        else {

             await waiter.addWaiter(name, email, code)


            req.flash('success', 'You have succesfully registered, your code is: ' + code)

        
            res.redirect(`/login/${req.body.setWaiter}`)

        }

    }

    async function displayLogin(req, res) {
        var username = req.params.name
        res.render('login', {
           
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
        
        
        if(waiter_name !== "Admin"){

            res.render('schedule', {
                name: waiter_name,
                waiter: await waiter.showDays(),

                monday: await waiter.keepdaysChecked(waiter_name, "Monday"),
                tuesday: await waiter.keepdaysChecked(waiter_name, "Tuesday"),
                wednesday: await waiter.keepdaysChecked(waiter_name, "Wednesday"),
                thursday: await waiter.keepdaysChecked(waiter_name, 'Thursday'),
                friday: await waiter.keepdaysChecked(waiter_name, "Friday"),
                saturday: await waiter.keepdaysChecked(waiter_name, "Saturday"),
                sunday: await waiter.keepdaysChecked(waiter_name, "Sunday"),
            })
       
        }
        else{

            res.redirect('/days')
        }
    }
    async function addDays(req, res) {
        
        let waiter_name = req.params.name
        let days = req.body.days

        let pickedDays = Array.isArray(days) === false ? [days] : days
      
   
        if(!pickedDays){
            
            req.flash('error', 'No days selected!')
            await waiter.deleteByName(waiter_name)

         
        }
         if(pickedDays.length < 3){
            req.flash('error', 'Please select 3 days or more')
            
            
        }
       else{

            await waiter.pickDays(req.params.name, req.body.days)
            
            req.flash('success', 'You have succesfully added your working days!')
        }
    
    
        res.redirect(`/schedule/${req.params.name}`)

    }

   

    async function removeWaiters(req, res) {

        
        req.flash('success', 'You have reseted the schedule')
        await waiter.removeDays()

        res.redirect('/days')

    }

    async function removeWaiterDay(req, res){

        let waiter_day = req.params.day

         req.flash('success', 'You have removed the waiters for this day')
         await waiter.deleteWaiterDay(waiter_day)

        res.redirect('/days')
    }
   
    async function displayForAdmin(req, res) {


        let waiter_name = req.params.setWaiter

       

        res.render('showDays', {
             name: waiter_name,
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

    return {
        addUser,
        displayLogin,
        addDays,
        displayDays,
        displayForAdmin,
        removeWaiters,
        displayRegPage,
        addCode,
        removeWaiterDay,

    }
}