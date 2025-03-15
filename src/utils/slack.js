import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import logger from "./logger_utils.js"

dotenv.config({ path: "../config/config.env" });


export const sendSlackMessage = async (message, user) => {
  const slackUrl = process.env.SLACK_WEBHOOK_URL
  try {
    const response = await axios.post(
      slackUrl,
      {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*📅 Booking Details*"
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": `*Date:* ${message.date}`
              },
              {
                "type": "mrkdwn",
                "text": `*Status:* ${message.status}`
              },
              {
                "type": "mrkdwn",
                "text": `*Booking ID:* ${message.bookingId}`
              },
              {
                "type": "mrkdwn",
                "text": `*User ID:* ${user.userId}`
              },
              {
                "type": "mrkdwn",
                "text": `*Email:* ${user.email}`
              }
            ]
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*🏪 Shop Details*"
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": `*Shop Name:* ${message.shopDetails.shopName}`
              },
              {
                "type": "mrkdwn",
                "text": `*Address:* ${message.shopDetails.shopAddress}`
              },
              {
                "type": "mrkdwn",
                "text": `*Telephone:* ${message.shopDetails.telephone}`
              },
              {
                "type": "mrkdwn",
                "text": `*Open Time:* ${message.shopDetails.openTime} - ${message.shopDetails.closeTime}`
              }
            ]
          },
        ]
      }
      ,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    logger.info("send information to slack: " + slackUrl)
    return response.data;
  } catch (error) {
    console.error(
      "Slack Webhook Error:",
      error.response?.data || error.message
    );
  }
};

// app.post("/slack/send", async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ error: "Text message is required" });
//   }

//   try {
//     await sendSlackMessage(text);
//     res.json({ success: true, message: "Message sent to Slack successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
