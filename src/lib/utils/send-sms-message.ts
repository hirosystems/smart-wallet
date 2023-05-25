import twilio from 'twilio';

import { APP_URL } from '../modules/constants';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export const sendSmsMessage = async (
  phoneNumber: string,
  body: string
) => {
  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log(message.sid);
    return message;
  } catch (error) {
    console.error(error);
  }
};

export const bodyNotifyToSign = (
  ownerStxAddress: string,
  txid: string
) => {
  const url = `${APP_URL}/authenticate?address=${ownerStxAddress}&txid=${txid}`;
  return `You have received a request to sign a transaction for ${ownerStxAddress}. Please go to this url ${url} to sign the transaction.`;
};

export const bodyNotifyAsCoSigner = (
  ownerStxAddress: string,
  coSignerAddress: string
) => {
  return `You have been added as a co-signer for ${ownerStxAddress} with your address ${coSignerAddress}.`;
};

export const bodyNotifyOwner = (
  ownerStxAddress: string,
  coSignerAddress: string,
  txId: string
) => {
  return `Your transaction https://explorer.hiro.so/txid/${txId} made with address ${ownerStxAddress}?chain=testnet has been signed by ${coSignerAddress}.`
};