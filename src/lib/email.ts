import nodemailer from "nodemailer";

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const EMAIL_FROM = process.env.EMAIL_FROM || "SoloKit <info@drilonhametaj.it>";

interface SendPurchaseEmailParams {
  to: string;
  customerName?: string;
  productName: string;
  downloadUrl: string;
  orderAmount: number;
  currency: string;
}

export async function sendPurchaseEmail({
  to,
  customerName,
  productName,
  downloadUrl,
  orderAmount,
  currency,
}: SendPurchaseEmailParams) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(orderAmount);

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: to,
    subject: `Your SoloKit Purchase: ${productName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f; color: #fafafa; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #53C0B4; font-size: 28px; margin: 0;">SoloKit</h1>
            </div>

            <div style="background-color: #111118; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #fafafa; font-size: 24px; margin: 0 0 16px;">Thank you for your purchase!</h2>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                ${customerName ? `Hi ${customerName},` : "Hi there,"}<br><br>
                Your purchase of <strong style="color: #fafafa;">${productName}</strong> is complete.
              </p>

              <div style="background-color: #1a1a24; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 8px;">Order Total</p>
                <p style="color: #fafafa; font-size: 24px; font-weight: bold; margin: 0;">${formattedAmount}</p>
              </div>

              <a href="${downloadUrl}" style="display: inline-block; background-color: #53C0B4; color: #0a0a0f; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Download Your Files
              </a>

              <p style="color: #71717a; font-size: 14px; margin: 24px 0 0;">
                This download link will expire in 7 days. You can download up to 5 times.
              </p>
            </div>

            <div style="text-align: center; color: #71717a; font-size: 14px;">
              <p style="margin: 0 0 8px;">Need help? Reply to this email.</p>
              <p style="margin: 0;">
                <a href="${process.env.NEXT_PUBLIC_URL}" style="color: #53C0B4; text-decoration: none;">solokit.co</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  return { id: info.messageId };
}
