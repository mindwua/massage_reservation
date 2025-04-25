import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import logger from "./logger_utils.js"

dotenv.config({ path: "../config/config.env" });
export const sendSlackMessage = async (message, user) => {
  const slackUrl = "https://slack.com/api/chat.postMessage";
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error('Slack bot token is not defined in environment variables.');
  }
  const payload = {
    channel: "#all-cu",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*:date: Booking Details*",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Date:* ${message.date || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Status:* ${message.status || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Booking ID:* ${message.bookingId || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*User ID:* ${user.userId || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Email:* ${user.email || "N/A"}`,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*:corner_shop: Shop Details*",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Shop Name:* ${message.shopDetails?.shopName || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Address:* ${message.shopDetails?.shopAddress || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Telephone:* ${message.shopDetails?.telephone || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Open Time:* ${message.shopDetails?.openTime || "N/A"} - ${message.shopDetails?.closeTime || "N/A"}`,
          },
        ],
      },
    ],
  };
  try {
    const response = await axios.post(slackUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    logger.info(`Sent Slack message to channel ${payload.channel}`);
    return response.data;
  } catch (error) {
    logger.error("Slack API Error:", error.response?.data || error.message);
    throw error; // rethrow if you want the caller to handle
  }
};






