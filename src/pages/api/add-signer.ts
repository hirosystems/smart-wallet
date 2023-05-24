import {
  bodyNotifyAsCoSigner,
  sendSmsMessage,
} from '~/lib/utils/send-sms-message';

import { signers } from './store';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { address, userAddress, email, phoneNumber } = req.body;
    if (!userAddress) {
      res.status(400).json({ message: 'User address is required' });
      return;
    }
    if (!address) {
      res.status(400).json({ message: 'Address is required' });
      return;
    }

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    if (!phoneNumber) {
      res.status(400).json({ message: 'Phone number is required' });
      return;
    }

    signers[userAddress] = signers[userAddress] || [];
    signers[userAddress].push({ address, email, phoneNumber });
    console.log('signers', signers);
    // Send sms to the second signer
    // const body = bodyNotifyAsCoSigner(userAddress, address);
    // const message = await sendSmsMessage(phoneNumber, body);
    res.status(200).json({
      message: 'Signer added',
      data: { signers: signers[userAddress] },
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
