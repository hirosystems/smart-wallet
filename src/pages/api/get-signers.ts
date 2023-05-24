import { signers } from './store';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userAddress } = req.query;
    if (!userAddress) {
      res.status(400).json({ message: 'User address is required' });
      return;
    }
    const userSigners = signers[userAddress] || [];
    res.status(200).json({ data: { signers: userSigners } });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
