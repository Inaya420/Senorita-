const axios = require("axios");

const apiList =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const getMainAPI = async () => {
  const res = await axios.get(apiList, {
    timeout: 15000
  });

  return res.data.simsimi;
};

module.exports.config = {
  name: "autoreplybot",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU + FAHAD",
  description: "Smart Auto Reply Bot",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};


// ===============================
// FIXED REPLIES
// ===============================

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
    "R koto Vabi dekha lgbe?",

  "chup":
    "Tmr kotha moto? 😑",

  "assalamualaikum":
    "Walaikumassalam ❤️‍🩹",

  "salam":
    "Walaikumassalam ❤️",

  "fork":
    "nei😑",

  "kiss me":
    "Close your Eyes 👀",

  "thanks":
    "Mention not 💟",

  "thank you":
    "Welcome 😌",

  "i love you":
    "Sure? 👀",

  "love you":
    "Dhonnobad 😌",

  "by":
    "Tata 👋",

  "bye":
    "Tata 👋",

  "ki somossa":
    "Tmr ki Somossa?",

  "bot er baccha":
    "Amr baccha tmr pete 🐸😂",

  "tmr namm ki":
    "SENORITA ✨",

  "tomar nam ki":
    "SENORITA ✨",

  "pic de":
    "Kisher pic?",

  "cudi":
    "cdlm na 😑",

  "bal":
    "kar? tomar? 😂",

  "baal":
    "kar? tomar? 😂",

  "hatt":
    "🥴🥴",

  "🫦":
    "ki naki? 👀",

  "ki koro":
    "Ki r krbo valo lge na. Gaan shuni 🎧",

  "tmr size koto?":
    "Inbox e asho bolteci 🌚",

  "bot":
    "Bolo 😑",

  "valo acho?":
    "Always valo thaki, chap nei 😎",

  "kemon acho?":
    "Valoi achi 😌 tumi?",

  "kemon acho":
    "Valoi achi 😌 tumi?",

  "kmn acho":
    "Valoi achi 😌 tumi?",

  "pagol":
    "Mad! 🤡",

  "breakup":
    "koto ashbe koto jabe 🤡",

  "tmi ke?":
    "bot 😑",

  "tumi ke":
    "bot 😑",

  "umm":
    "haee 😌",

  "hmm":
    "okk",

  "hmmm":
    "okk",

  "love":
    "hatt ❤️‍🔥"

};


// ===============================
// SMART AUTO REPLY
// ===============================

module.exports.handleEvent = async function ({ api, event }) {

  const {
    threadID,
    messageID,
    body,
    senderID
  } = event;

  if (!body) return;

  const msg = body.toLowerCase().trim();

  if (!msg) return;


  // =================================
  // 1. FIRST CHECK FIXED REPLY
  // =================================

  if (responses[msg]) {

    return api.sendMessage(
      responses[msg],
      threadID,
      (err, info) => {

        if (err) return;

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "sahu"
        });

      },
      messageID
    );
  }


  // =================================
  // 2. IF NO FIXED REPLY
  //    THEN USE AI/API
  // =================================

  try {

    const base = await getMainAPI();

    if (!base) return;


    const link =
      `${base}/simsimi?text=${encodeURIComponent(body)}`;


    const res = await axios.get(link, {
      timeout: 15000
    });


    let reply = res.data.response;


    if (Array.isArray(reply)) {
      reply = reply[0];
    }


    if (!reply || typeof reply !== "string") {
      return;
    }


    // =================================
    // SEND API REPLY
    // =================================

    return api.sendMessage(
      reply,
      threadID,
      (err, info) => {

        if (err) return;

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "sahu"
        });

      },
      messageID
    );


  } catch (error) {

    console.error(
      "AUTO REPLY API ERROR:",
      error.message
    );

    return;
  }

};


// ===============================
// REPLY TO USER
// ===============================

module.exports.handleReply = async function ({
  api,
  event,
  handleReply
}) {

  if (!handleReply) return;

  if (event.senderID !== handleReply.author) {
    return;
  }


  const text = event.body?.trim();

  if (!text) return;


  try {

    const base = await getMainAPI();

    if (!base) return;


    const link =
      `${base}/simsimi?text=${encodeURIComponent(text)}`;


    const res = await axios.get(link, {
      timeout: 15000
    });


    let reply = res.data.response;


    if (Array.isArray(reply)) {
      reply = reply[0];
    }


    if (!reply) {
      reply = "🙂 বুঝলাম না, আবার বলো";
    }


    return api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {

        if (err) return;

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "sahu"
        });

      },
      event.messageID
    );


  } catch (error) {

    console.error(
      "REPLY API ERROR:",
      error.message
    );

    return api.sendMessage(
      "🙂 একটু পরে আবার বলো",
      event.threadID,
      event.messageID
    );

  }

};


// ===============================
// COMMAND RUN
// ===============================

module.exports.run = async function ({
  api,
  event
}) {

  return module.exports.handleEvent({
    api,
    event
  });

};
