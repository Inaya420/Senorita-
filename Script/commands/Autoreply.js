const axios = require("axios");

const apiList =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const getMainAPI = async () => {
  const res = await axios.get(apiList, {
    timeout: 15000
  });

  return res.data.simsimi;
};


// =================================
// DUPLICATE MESSAGE PROTECTION
// =================================

const processedMessages = new Set();


// =================================
// CONFIG
// =================================

module.exports.config = {
  name: "autoreplybot",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU + FAHAD",
  description: "Smart Auto Reply Bot",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};


// =================================
// FIXED REPLIES
// =================================

const responses = {

  "miss you": "pglcoda🥴",
  "miss u too": "Baal miss koro!",
  "kiss de": "Dat brush koro age",
  "👍": "Like dissao keno?",

  "hi": "ki?",
  "hello": "Hello 😎",
  "hey": "Heyy 👀",

  "bc": "ke? tmi?",
  "pro": "kelba? 1v1☠️",

  "good morning": "MORNING 🌞",
  "good night": "okay Tata sono dekho jaww 🌙",

  "tor ball": "~ tomar ekhono uthce? amare kow",

  "fahad":
    "vai je amare keno banalo, offline ei valo cilm etodin🙂",

  "owner":
    "FAHAD!!!!!! Tomare dake😭",

  "admin":
    "FAHAD Bhai, FAHAD BHAIII 💪",

  "vabi":
    "R koto Vabi dek
