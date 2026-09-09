const { Worker } = require("bullmq");

const connection = require("../config/redis");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const worker = new Worker(
  "email",

  async (job) => {
    console.log("Processing email job", job.id);

    const { email, token } = job.data;

    await transporter.sendMail({
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

    console.log("Email sent to", email);
  },

  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.log("Email failed", error);
});
