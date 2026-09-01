const axios = require("axios");

const apiList =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const getMainAPI = async () => {
  const res = await axios.get(apiList);
  return res.data.simsimi;
};

module.exports.config = {
  name: "autoreplybot",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Auto Reply Bot",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;

  if (!body) return;

  const msg = body.toLowerCase().trim();

  const responses = {
    "miss you": "pglcoda🥴",
    "miss u too": "Baal miss koro!",
    "kiss de": "Dat brush koro age",
    "👍": "Like dissao keno?",
    "hi": "ki?",
    "bc": "ke? tmi?",
    "pro": "kelba? 1v1☠️",
    "good morning": "MORNING",
    "good night": "okay Tata sono dekho jaww",
    "tor ball": "~ tomar ekhono uthce? amare kow",

    "fahad":
      "vai je amare keno banalo, offline ei valo cilm etodin🙂",

    "owner":
      "‎FAHAD!!!!!! Tomare dake😭",

    "admin":
      "FAHAD Bhai, FAHAD BHAIII💪",

    "vabi":
      "R koto Vabi dekha lgbe?",

    "chup":
      "Tmr kotha moto?",

    "assalamualaikum":
      "Walaikumassalam ❤️‍🩹",

    "fork":
      "nei😑",

    "kiss me":
      "Close your Eyes👀",

    "thanks":
      "Mention not💟",

    "i love you":
      "Sure?",

    "love you":
      "Dhonnobad",

    "by":
      "Tata",

    "ki somossa":
      "Tmr ki Somossa?",

    "bot er baccha":
      "Amr baccha tmr pete🐸. Iykyk😂",

    "tmr namm ki":
      "SENORITA✨",

    "pic de":
      "Kisher pic?",

    "cudi":
      "cdlm na",

    "bal":
      "kar? tomar?",

    "hatt":
      "🥴🥴",

    "🫦":
      "ki naki? meye dekhlei ki hoye jai naki?",

    "ki koro":
      "Ki r krbo valo lge na. Gaan shuni",

    "tmr size koto?":
      "Inbox e asho bolteci🌚",

    "bot":
      "Bolo",

    "valo acho?":
      "Always valo thaki, chap nei",

    "pagol":
      "Mad!",

    "breakup":
      "koto ashbe koto jabe🤡",

    "tmi ke?":
      "bot😑",

    "umm":
      "haee",

    "hmm":
      "okk",

    "love":
      "hatt"
  };

  // Fixed reply
  if (!responses[msg]) return;

  if (!global.client.handleReply) {
    global.client.handleReply = [];
  }

  return api.sendMessage(
    responses[msg],
    threadID,
    (err, info) => {
      if (err) return console.error(err);

      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "sahu"
      });
    },
    messageID
  );
};


module.exports.handleReply = async function ({
  api,
  event,
  handleReply
}) {
  if (!handleReply) return;

  if (event.senderID !== handleReply.author) return;

  try {
    const text = event.body?.trim();

    if (!text) return;

    const base = await getMainAPI();

    if (!base) {
      return api.sendMessage(
        "⚠️ API পাওয়া যাচ্ছে না!",
        event.threadID,
        event.messageID
      );
    }

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
      reply = "🙂 একটু পরে আবার বলো";
    }

    return api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        if (err) return console.error(err);

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
    console.error("AutoReply API Error:", error);

    return api.sendMessage(
      "🙂 একটু পরে আবার বলো",
      event.threadID,
      event.messageID
    );
  }
};


module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({
    api,
    event
  });
};
