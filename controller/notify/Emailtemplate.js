const getName = (username) => {
    return  `<html>

    <head>
    <title>Registration Success</title>
    </head>
    <body>
        <p>
            <span >${'Welcome ' + username}</span>
        </p>
        <br />
        <ul style="width: 600px; list-style-type: none; list-style: none;padding-left: 0px;">
            <li><a href="https://www.stylori.com" target="_blank"> <img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_01.jpg" alt="" border="0"/></a></li>
            <li>
                <ul style="list-style-type: none; list-style: none; padding: 10px 10px;text-align: center;">
                    <li style="display: inline; padding: 0px 3px; text-decoration: none;">
                        <a href="http://54.251.178.11/jewellery/pendants" target="_blank" style="text-decoration:none;color:#4F4C4C;">Pendants</a>
                    </li>
                    <li style="display: inline; padding: 0px 2px;">|</li>
                    <li style="display: inline; padding: 0px 2px;"><a href="https://www.stylori.com/jewellery/earrings" target="_blank" style="text-decoration:none;color:#4F4C4C;">Earrings</a></li>
                    <li style="display: inline; padding: 0px 2px;">|</li>
                    <li style="display: inline; padding: 0px 2px;"><a href="https://www.stylori.com/jewellery/bangles/Bangles" target="_blank" style="text-decoration:none;color:#4F4C4C;">Bangles</a></li>
                    <li style="display: inline; padding: 0px 2px;">|</li>
                    <li style="display: inline; padding: 0px 2px;"><a href="https://www.stylori.com/jewellery/bangles/bracelets" target="_blank" style="text-decoration:none;color:#4F4C4C;">Bracelets</a></li>
                    <li style="display: inline; padding: 0px 2px;">|</li>
                    <li style="display: inline; padding: 0px 2px;"><a href="https://www.stylori.com/jewellery/rings" target="_blank" style="text-decoration:none;color:#4F4C4C;">Rings</a></li>
                    <li style="display: inline; padding: 0px 2px;">|</li>
                    <li style="display: inline; padding: 0px 2px;"><a href="https://www.stylori.com/jewellery/nosepins" target="_blank" style="text-decoration:none;color:#4F4C4C;">Nose
                            Pins</a></li>
                </ul>
            </li>
            <li><a href="https://instagram.com/stylorilove" target="_blank">
                    <img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_03.jpg" alt="" border="0"/>
            </a></li>
            <li><img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_04.jpg" alt="" border="0"/></li>
            <li><img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_05.jpg" alt="" border="0"/></li>
            <li><img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_06.jpg" alt="" border="0"/></li>
    
            <li><img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_07.jpg" alt="" border="0"/></li>
    
            <li><img src="https://assets-cdn.stylori.com/images/emailTemplate/registration-emailer-01_08.jpg" alt="" border="0"/></li>
    
            <li>
    
                <ul style="list-style-type: none; list-style: none; padding: 10px 5px; margin: 20px 63px; text-align: center; border-style: solid; border-color: #CC1E53;">
    
                    <li style="display: inline;">
                              <a href="https://www.stylori.com/stories" target="_blank"><img src="https://assets-cdn.stylori.com/images/emailTemplate/text.png" style="margin-bottom:13px;"/></a>
                                 </li>
                    
                    <li style="display: inline;">
                                           <a target="_blank" href="https://www.facebook.com/stylori" style="color: #CC1E53;"><img src="https://assets-cdn.stylori.com/images/emailTemplate/icon01.png"/></a>
                                    </li>
    
    
                    <li style="display: inline;">
                        <a target="_blank" href="https://twitter.com/StyloriLove" style="color: #CC1E53;"><img src="https://assets-cdn.stylori.com/images/emailTemplate/icon02.png"/></a>
                    </li>
    
    
                    <li style="display: inline;">
                        <a href="https://instagram.com/stylorilove" style="color: #CC1E53;" target="_blank"><img src="https://assets-cdn.stylori.com/images/emailTemplate/icon03.png"/></a>
                    </li>
    
    
                    <li style="display: inline;">
                        <a href="https://in.pinterest.com/stylori2015/" style="color: #CC1E53;" target="_blank"><img src="https://assets-cdn.stylori.com/images/emailTemplate/icon04.png"/></a>
                    </li>
    
    
                    <li style="display: inline;">
                        <a href="https://www.youtube.com/c/stylori" style="color: #CC1E53;" target="_blank"><img src="https://assets-cdn.stylori.com/images/emailTemplate/icon05.png"/></a>
                    </li>
                </ul>
    
                <ul style="list-style-type: none; list-style: none; padding: 10px 5px; margin: 5px 150px;">
    
                    <li style="display: inline; color: #A4C639;"></li>
    
                    <li style="display: inline; margin-bottom: 5px;"><a href="https://play.google.com/store/apps/details?id=com.pranion.stylori&amp;hl=en" target="_blank">
                            <img src="https://assets-cdn.stylori.com/images/emailTemplate/icon06.png"/>
                    </a></li>
    
                </ul>
    
                <ul style="list-style-type: none; list-style: none; padding: 10px 5px; margin: 5px 80px;">
                    <li style="display: inline;color:#4F4C4C;">Copyright @ 2016</li>
                    <li style="display: inline;">|</li>
                    <li style="display: inline;"><a href="https://www.stylori.com" target="_blank" style="text-decoration:none;color:#4F4C4C;">stylori.com</a></li>
                    <li style="display: inline;">|</li>
                    <li style="display: inline;color:#4F4C4C;">All rights reserved.</li>
                </ul>
    
            </li>
    
    
        </ul>
    </body>
    </html>`;
  };

  const forgotpasswordTemp = (username,email,token) => {
    return  `<!doctype html>
    <html>
    <head>
    
    <title>Regiter authentication</title>
    </head>
    
    <body>
    <div style="width:600px;background:#fff;">
    <table style="width:600px">
        <thead>
            <img src="https://assets-cdn.stylori.com/images/emailTemplate/cash-on-deli-hdr.jpg" />
        </thead>
        <tbody>
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: bold;color: rgba(88,89,91,1.00);margin:25px 0px;">
                <h5>Hello <span >Hello ${username},</span></h5>
                </p>
            </tr>
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: rgba(88,89,91,1.00); line-height:1.6;float:left;">We received a request to reset the password associated with this 
                        e-mail address. If you made this request, please follow the instructions below.</p>
            </tr>
            
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: rgba(88,89,91,1.00);line-height:1.6;">
                Click on the link below to reset your password using our secure server:</p>
            </tr>
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: #ed1164;">
                    <span style="color: #ed1164;text-decoration:none;">${token}</span>
                </p>
            </tr>
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: rgba(88,89,91,1.00);line-height:1.6;">If you did not request to have your password reset you can safely ignore this email.</p>
            </tr>
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: rgba(88,89,91,1.00);line-height:1.6;">If clicking the link does not seem to work, you can copy and paste the link into your browser's address window, or retype it there. Once you have returned to Stylori, we will give instructions for resetting your password.</p>
            </tr>
            <tr>
                <p style="padding:0px 15px;font-family: 'Arial', sans-serif;font-size: 11px;font-weight: 400;color: rgba(88,89,91,1.00);line-height:1.6;float: left;margin-bottom: 20px;">Stylori  will never e-mail you and ask you to disclose or verify your Stylori password, credit card, or banking account number. If you receive a suspicious e-mail with a link to update your account information, do not click on the link--instead, report the e-mail to Stylori for investigation. Greetings from Stylori.com</p>
            </tr>
           
        </tbody>
    
    </table>
     <div style="position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 100%;background: rgba(215,221,249,1.00);padding: 10px 0px 20px 0px;">
                <p style="padding: 0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: rgba(88,89,91,1.00);width: 45%;float: left;margin: 0;">Customer Care: 1800-102-0330</p>
                <p style="padding: 0px 15px;font-family: 'Arial', sans-serif;font-size: 12px;font-weight: 400;color: rgba(88,89,91,1.00);width: 24%;float: left;margin: 0;padding-left:0;position: relative;left: 130px;">
                Contact: hello@stylori.com</p>
            </div>
    </div>
    
    
    </body>
    </html>
    `;
  };
  const emailTemplate = {};
  emailTemplate.getName = getName;
  emailTemplate.forgotpasswordTemp = forgotpasswordTemp;
module.exports = emailTemplate
