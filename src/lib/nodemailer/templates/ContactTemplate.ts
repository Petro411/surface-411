const ContactTemplate = ({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>New Contact Form Submission</h2>
    <p>You have received a new message from your website contact form:</p>

    <div style="margin: 20px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #007BFF; margin-top: 5px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
    </div>

    <p>Please reply to this email if needed.</p>
    <br>
    <small>— Surface411 Website</small>
  </div>
`;

export default ContactTemplate;
