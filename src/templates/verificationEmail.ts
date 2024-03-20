export const generateVerificationEmail = (token: string) => {
  return `<div style="text-align: center; background: #f8f8ff; padding: 20px; border-radius: 6px; color: #000000; max-width: 50%; margin: 0 auto;">
  <div style="font-weight: 600; font-size: 24px; margin-bottom: 20px;">baddit.life</div>
  <div style="margin-top: 20px;">Thank you for signing up with us. Please verify your account by clicking the button below.</div>
  <div style="margin-top: 20px;"><a href="https://${process.env.DOMAIN}/auth?emailToken=${token}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">Verify Account</a></div>
  </div>`;
};
