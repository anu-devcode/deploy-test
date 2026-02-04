# Adis Harvest Email System Setup Guide

This guide details how to configure the email system for both development and production environments, using **Brevo (formerly Sendinblue)** as the recommended SMTP provider.

## 1. Prerequisites

- A [Brevo account](https://www.brevo.com/) (Free tier allows 300 emails/day).
- Access to the project's `.env` files.

## 2. Configuration (`.env`)

You need to configure the SMTP settings in `backend-ecommerce/.env`.

### 2.1. Getting Brevo Credentials
1. Log in to Brevo.
2. Go to **Transactional** > **Settings** > **SMTP & API**.
3. Select the **SMTP** tab.
4. Generate a new SMTP Key.

### 2.2. Setting Environment Variables
Add the following to your `backend-ecommerce/.env` file:

```env
# Email / SMTP Configuration (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email@example.com
SMTP_PASS=your-generated-smtp-master-password
SMTP_FROM="Adis Harvest <noreply@adisharvest.com>"
```

> **Note**: For development, you can use the same credentials. Emails will be sent to real addresses, so use your own email for testing.

## 3. Environment Specifics

### Development (`npm run dev`)
- Emails are sent using the configured SMTP.
- If SMTP fails or is invalid, the backend will log the error to the console but **will not crash**.
- Check the backend terminal for logs: `[EmailService] Sent email to...`

### Production (`npm run start:prod`)
- Ensure variables are set in your deployment platform (Vercel, Railway, AWS, etc.).
- **Important**: Verify your domain in Brevo (Senders & IP) to ensure high deliverability and avoid Spam folders.

## 4. Admin Portal Control
The Admin Portal (`/admin`) allows you to manage marketing communications:

1. **Dashboard**: View high-level stats.
2. **Marketing**:
   - **Campaigns**: View past and scheduled campaigns.
   - **Create Campaign**: Send newsletters or promotional emails to all subscribed users.
   - **Subscribers**: View users who have opted into marketing.

## 5. Troubleshooting

- **Error: 535 Authentication Failed**: Check `SMTP_USER` and `SMTP_PASS`. Note that `SMTP_PASS` is the **SMTP Key**, not your login password.
- **Emails going to Spam**: Verify your sender domain in Brevo settings.
- **Rate Limits**: Free tier is limited to 300 emails/day.

## 6. Testing Flow
1. **Register**: Sign up a new user. You should receive a "Verify Email".
2. **Forgot Password**: Use the forgot password feature on login.
3. **Admin**: Create a test campaign and send it to yourself.
