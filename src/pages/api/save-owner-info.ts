import { ownersInfo } from './store';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userAddress, email, phoneNumber } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    if (!phoneNumber) {
      res.status(400).json({ message: 'Phone number is required' });
      return;
    }

    ownersInfo[userAddress] = { email, phoneNumber }
    console.log('ownersInfo', ownersInfo);
    res.status(200).json({
      message: 'Signer added',
      data: { ownerInfo: ownersInfo[userAddress] },
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
