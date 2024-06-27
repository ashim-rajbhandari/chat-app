const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { emailTemplate } = require('shared/src/database/models');
const config = require('config');
const mail = config.get('mail');
class EmailService {
  constructor() {
    this.model = emailTemplate;
    this.smtpEndpoint = mail.MAIL_HOST;
    this.port = mail.MAIL_PORT;
    this.senderAddress = mail.MAIL_FROM_ADDRESS;
    this.smtpUsername = mail.MAIL_USERNAME;
    this.smtpPassword = mail.MAIL_PASSWORD;
  }

  async sendSMTPEmail(data) {
    try {
      const emailData = await this.buildEmailPayload(data);
      // Create the SMTP transport.
      const config = {
        host: this.smtpEndpoint,
        port: this.port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.smtpUsername,
          pass: this.smtpPassword
        },
        logger: false,
        debug: true
      };
      let transporter = nodemailer.createTransport(config);
      // Specify the fields in the email.
      let mailOptions = {
        from: this.senderAddress,
        to: emailData.toEmail,
        subject: emailData.subject,
        text: emailData.body_text,
        html: emailData.body_html
        // headers: {
        //     'X-SES-MESSAGE-TAGS': tag0
        // }
      };
      let info = await transporter.sendMail(mailOptions);
      console.log('Message sent! Message ID: ', info.messageId);
    } catch (e) {
      console.log('email error ' + e.message);
      return;
    }
  }

  async buildEmailPayload(data) {
    let toEmail = data.email;
    let template = await this.getTemplate(data);
    let subject = template.subject;
    const templateHtml = await ejs.renderFile(
      __dirname + '/../commonViews/email/send-mail.ejs',
      { body: template.body }
    );
    let strHtml = templateHtml
      .replace('%username%', data.username)
      .replace('%token%', data.token)
      .replace('%otp_code%', data.otp_code)
      .replace('%url%', data.url)
      .replace('%password%', data.password);
    let body_text = template.subject;
    let body_html = strHtml;
    return {
      toEmail,
      subject,
      body_text,
      body_html
    };
  }

  async getTemplate(data) {
    return this.model.findOne({ where: { code: data.code } });
  }
}

module.exports = EmailService;
