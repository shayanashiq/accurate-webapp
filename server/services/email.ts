import {
  RESET_PASSWORD,
  SUBJECT_VERIFY_EMAIL,
  TOKEN_FOR_RESETTING_PASSWORD,
} from '@/constants';
import getDomain from '../utils/getDomain';
import { generateToken } from './token';
import { send } from './mailjet';

export const sendForgetPasswordEmail = async (email: string) => {
  const text = `
        Hi, click here ${getDomain()}/reset-password?token=${generateToken({
          tokenFor: TOKEN_FOR_RESETTING_PASSWORD,
          data: { email },
        })}
        to reset password
    `;
  await send({
    to: email,
    from: process.env.FROM_EMAIL as string,
    subject: RESET_PASSWORD,
    text,
  });
};

export const sendVerificationEmail = (email: string) => {
  const text = `
        Hi, click here ${getDomain()}/verification?token=${generateToken({
          tokenFor: TOKEN_FOR_RESETTING_PASSWORD,
          data: { email },
        })}
        to verify your email address
    `;
  send({
    to: email,
    from: process.env.FROM_EMAIL as string,
    subject: SUBJECT_VERIFY_EMAIL,
    text,
  });
};
