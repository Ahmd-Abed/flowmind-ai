const { Worker } = require("bullmq");
require("dotenv").config();

const connection = require("../config/redis");
const { sendInvitationEmail } = require("../utils/email");

const worker = new Worker(
  "email",

  async (job) => {
    console.log("Processing email job", job.id);

    const { email, token } = job.data;

    await sendInvitationEmail({ email, token });

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
