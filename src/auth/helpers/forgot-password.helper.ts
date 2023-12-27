import * as crypto from 'crypto';

export const getPasswordResetUrl = (forgotToken: string) => {
  const resetUrl = `${process.env.CLIENT_DOMAIN}/${process.env.CLIENT_ROUTE}/${forgotToken}`;
  return resetUrl;
};

export const getForgotPasswordToken = () => {
  const forgotToken = crypto.randomBytes(20).toString('hex');

  const forgotPasswordToken = getEncryptedToken(forgotToken);
  const forgotPasswordExpiry = Date.now() + 20 * 60 * 1000; // 20 mins

  return { forgotToken, forgotPasswordToken, forgotPasswordExpiry };
};

export const getEncryptedToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
