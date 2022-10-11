module.exports = function WaitersRoutes(waiter) {

    const ShortUniqueId = require("short-unique-id")
    const uid = new ShortUniqueId({ length: 6 });

    async function displayReg(req, res) {
        let user = req.session.user

        res.render('register', {
            user: req.session.user,


        })

    }


    async function addUser(req, res) {


        let name = req.body.setWaiter
        let email = req.body.email

        const code = uid()

        const get_user = await waiter.findUser(name)

        if (get_user.count == 1) {

            req.flash('error', 'User already exists')

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
        let user = req.session.user
        var username = req.params.name
        res.render('login', {
            user: req.session.user,
            username: username
        })

    }

    async function addCode(req, res) {
        let { addCode } = req.body
        let user = req.params.name
        let getCode = await waiter.getCode(user)


        if (getCode.code === addCode) {
            req.flash('success', 'You have loged in succesfully')

            res.redirect("/schedule/" + user)

        } else if (getCode.code !== addCode) {


            req.flash('error', 'Enter the correct code given!')

            res.redirect("/login/" + user)
        }
    }



    async function displayDays(req, res) {

        let waiter_name = req.params.setWaiter


        if (waiter_name !== "Admin") {

            // req.flash('success', 'Welcome!')
            res.render('schedule', {
                name: waiter_name,
                waiter: await waiter.showDays()

            })
        }
        else {
            // req.flash('success', 'Welcome!')
            res.render('showDays', {
                name: waiter_name,
                monday: await waiter.showDaysforAdmin("Monday"),
                tuesday: await waiter.showDaysforAdmin("Tuesday"),
                wednesday: await waiter.showDaysforAdmin("Wednesday"),
                thursday: await waiter.showDaysforAdmin('Thursday'),
                friday: await waiter.showDaysforAdmin("Friday"),
                saturday: await waiter.showDaysforAdmin("Saturday"),
                sunday: await waiter.showDaysforAdmin("Sunday")
            })
        }

    }
    async function addDays(req, res) {

        req.flash('success', 'You have succesfully added your working days!')

        // console.log(req.params.name)
        // console.log(req.body.days)
        await waiter.pickDays(req.params.name, req.body.days)

        res.redirect(`/schedule/${req.params.name}`)

    }

    async function removeWaiters(req, res) {
        let waiter_name = req.params.name

        // console.log(waiter_name)

        req.flash('success', 'You have reseted the schedule')
        await waiter.removeDays()

        res.redirect('/reset')

    }
    // async function admin_waiterDays(req, res) {
    //     let waiter_name = req.params.name


    //     // console.log(selectD)
    //     res.render('showDays', {
    //         name: waiter_name,
    //         days: await waiter.showDays(),
    //         monday: await waiter.showDaysforAdmin("Monday"),
    //         tuesday: await waiter.showDaysforAdmin("Tuesday"),
    //         wednesday: await waiter.showDaysforAdmin("Wednesday"),
    //         thursday: await waiter.showDaysforAdmin('Thursday'),
    //         friday: await waiter.showDaysforAdmin("Friday"),
    //         saturday: await waiter.showDaysforAdmin("Saturday"),
    //         sunday: await waiter.showDaysforAdmin("Sunday")


    //     })

    // }
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
        addCode
        // admin_waiterDays


    }
}