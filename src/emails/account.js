const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'w.ennals@gmail.com',
        subject: 'Thank you for Joining',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const cancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'w.ennals@gmail.com',
        subject: 'We\'re sorry to see you go',
        text: `${name}, we see that you have canceled you're account. Please take a moment to tell us why and if there is anything we can do to bring you back.`
    })
}


module.exports = {
    sendWelcomeEmail,
    cancellationEmail
}