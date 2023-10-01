import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'optismailer@gmail.com',
                pass: 'ljmoedfzoiqfmsyj',
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: 'optismailer@gmail.com',
            to,
            subject: `Monster Systems. Активация аккаунта в CRM`,
            text: '',
            html: `<div>
                        <h1>Для активации аккаунта, пожалуйста, перейдите по ссылке:</h1>
                        <a href="${link}">${link}</a>
                    </div>`
        })
    }

    async sendForgotPasswordMail(to, link) {
        await this.transporter.sendMail({
            from: 'optismailer@gmail.com',
            to,
            subject: `Monster Systems. Восстановление пароля в CRM`,
            text: '',
            html: `<div>
                        <h1>Для сброса пароля, пожалуйста, перейдите по ссылке:</h1>
                        <a href="${link}">${link}</a>
                    </div>`
        })
    }
}


export default new MailService();

