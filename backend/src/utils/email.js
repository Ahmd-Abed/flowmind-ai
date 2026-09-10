const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_USER and EMAIL_PASSWORD must be configured");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return transporter;
};

const sendInvitationEmail = async ({ email, token }) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "FlowMind Workspace Invitation",
    html: `
<h2>You are invited to FlowMind AI</h2>

<p>
Click the link below to join the workspace:
</p>

<a href="http://localhost:3000/invitations/${token}">
Accept Invitation
</a>
`,
  });
};

module.exports = {
  sendInvitationEmail,
};
