import sendgrid from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  console.error("No SENDGRID_API_KEY found in environment");
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailMessage = async (
  to: string,
  body: string
) => {

  const msg = {
    to,
    from: "SmartWallet <brice@dobry.us>",
    subject: "Thanks for your support!",
    text: body,
    html: body,
  };
  console.log('msg', msg)
  return sendgrid.send(msg);
}