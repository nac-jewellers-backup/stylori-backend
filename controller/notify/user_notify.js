import aws from 'aws-sdk';

// Load your AWS credentials and try to instantiate the object.
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-south-1'
});
// Instantiate SES.
var ses = new aws.SES();
const sendMail = async (mails,bodycontent) => {
    console.log("i am here for test")
    return new Promise(async (resolve, rejects) => {
        if (Array.isArray(mails)) {
            console.log("1");
            Promise.all(mails.map(async (mail) => {
                var ses_mail = "From:manokarantk@gmail.com\n";
                ses_mail = ses_mail + "To: " + mail.to + "\n";
                ses_mail = ses_mail + "Subject: "+mail.subject+"  \n";
                ses_mail = ses_mail + "MIME-Version: 1.0\n";
                ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                ses_mail = ses_mail + "--NextPart\n";
                ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                ses_mail = ses_mail + bodycontent + "\n\n";
                var params = {
                    RawMessage: { Data: new Buffer.from(ses_mail) },
                    Destinations: [
                        mail.to
                    ],
                };
                // console.log('What I got in Mailer:\n',
                //     mail.to,
                //     mail.message,
                //     mail.slack_token,
                //     mail.push_message,
                //     mail.notification,
                //     mail.company_id,
                //     mail.url
                // )
                return new Promise(async (resolve, reject) => {
                    //Send email notification
                    ses.sendRawEmail(params, async function (err, data) {
                        if (err) {
                            console.log("====Mail Not Sent to :" + mail.to + "====")
                            console.log(err);
                           // sendErrToProdIssue("NOTIFY-AWS Mailer", process.env.NODE_ENV, err, new Date(), params)
                            reject()
                        }
                        else {
                            console.log("====Mail Sent to :" + mail.to + "====")
                            console.log(data);
                        }
                    })
                    
                    resolve();
                });
            })).then(() => resolve())
                .catch((err) => {
                    console.log(err);
                    sendErrToProdIssue("NOTIFY-Mailer Async", process.env.NODE_ENV, err, new Date(), mails)
                    rejects()
                })
        } 
       
    })
}
export {
    sendMail
}