import { sendEmailMessage } from '~/lib/utils/send-email';
import { bodyNotifyToSign, sendSmsMessage } from '~/lib/utils/send-sms-message';

import { signers } from './store';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { stxAddress, txId, id } = JSON.parse(req.body);
    if (!stxAddress) {
      res
        .status(400)
        .json({ message: 'User stx address required' });
      return;
    }

    if (!signers[stxAddress]) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const { email, phoneNumber } = signers[stxAddress][0];
    console.log("send message to", email, phoneNumber, "with", stxAddress, "as setStxAddress")

    try {
      const body = bodyNotifyToSign(stxAddress, txId, id);
      console.log('body message to send', body)
      const smsMessage = await sendSmsMessage(phoneNumber, body);
      const emailMessage = await sendEmailMessage(email, body);
      console.log('emailMessage', emailMessage);
      // const smsMessage = 
      // {
      //   "account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      //   "api_version": "2010-04-01",
      //   "body": "This is the ship that made the Kessel Run in fourteen parsecs?",
      //   "date_created": "Thu, 30 Jul 2015 20:12:31 +0000",
      //   "date_sent": "Thu, 30 Jul 2015 20:12:33 +0000",
      //   "date_updated": "Thu, 30 Jul 2015 20:12:33 +0000",
      //   "direction": "outbound-api",
      //   "error_code": null,
      //   "error_message": null,
      //   "from": "+15017122661",
      //   "messaging_service_sid": "MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      //   "num_media": "0",
      //   "num_segments": "1",
      //   "price": null,
      //   "price_unit": null,
      //   "sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      //   "status": "sent",
      //   "subresource_uris": {
      //     "media": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json"
      //   },
      //   "to": "+15558675310",
      //   "uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json"
      // }
      console.log('sms response', smsMessage);
      res.status(200).json({ message: 'Message sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending message' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
