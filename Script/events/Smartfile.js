const axios = require("axios");

const API_LIST =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

async function getAI() {
  const res = await axios.get(API_LIST, {
    timeout: 15000
  });

  return res.data.simsimi;
}

module.exports.config = {
  name: "smartchat",
  eventType: ["message"],
  version: "1.0.0",
  credits: "FAHAD",
  description: "Smart automatic chatbot"
};

module.exports.run = async function ({ api, event }) {
  try {
    const text = event.body;

    if (!text || !text.trim()) return;

    const botID = api.getCurrentUserID();

    // Bot নিজে যেন নিজের message-এর reply না দেয়
    if (event.senderID == botID) return;

    // Command হলে reply করবে না
    const prefix = global.config.PREFIX || "/";
    if (text.startsWith(prefix)) return;

    const apiURL = await getAI();

    if (!apiURL) return;

    const url =
      apiURL +
      "?text=" +
      encodeURIComponent(text);

    const response = await axios.get(url, {
      timeout: 20000
    });

    let reply =
      response.data?.response ||
      response.data?.message ||
      response.data?.answer;

    if (!reply) return;

    reply = String(reply).trim();

    if (!reply) return;

    return api.sendMessage(
      reply,
      event.threadID
    );

  } catch (error) {
    console.error("SmartChat Error:", error.message);
  }
};
