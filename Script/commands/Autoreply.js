const axios = require("axios");

const apiList = "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const getMainAPI = async () => (await axios.get(apiList)).data.simsimi;

module.exports.config = {
  name: "autoreplybot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
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
    "FAHAD": "vai je amare keno banalo, offline ei valo cilm etodin🙂",
    "owner": "‎FAHAD!!!!!!  Tomare dake😭",
    "admin": "FAHAD Bhai,FAHAD BHAIII💪",
    "Vabi": "R koto Vabi dekha lgbe?",
    "chup": "Tmr kotha moto?",
    "AssalamualaikuWalaikumassalamsalam❤️‍🩹",
    "fork": "nei😑",
    "kiss me": "Close your Eyes👀",
    "thanks": "Mention not💟",
    "i love you": "Sure?",
    "love you": "Dhonnobad",
    "by": "Tata",
    "ki somossa": "Tmr ki Somossa?",
    "bot er baccha": "Amr baccha tmr pete🐸.Iykyk😂",
    "tmr namm ki": " SENORITA✨ ",
    "pic de": "Kisher pic?",
    "cudi": "cdlm na",
    "bal": " kar? tomar?",
    "hatt": " 🥴🥴 ",
    "🫦": "ki naki? meye dekhlei ki  hoye jai naki?",
    "ki koro": "Ki r krbo valo lge na.Gaan shuni",
    "Tmr size koto?": "Inbox e asho bolteci🌚",
    "bot": "Bolo",
    "valo acho?": "Always valo thaki,chap nei",
    "pagol": "Mad!",
    "breakup": "koto ashbe koto jabe🤡",
    "tmi ke?": "bot😑",
    "umm": " haee",
    "hmm": "okk",
    "love": "hatt"
  }if
  if (!responses[msg]) return;

  if (!global.client.handleReply) global.client.handleReply = [];

  return api.sendMessage(
    responses[msg],
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "sahu"
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  try {
    const text = event.body.trim();

    const base = await getMainAPI();
    const link = `${base}/simsimi?text=${encodeURIComponent(text)}`;

    const res = await axios.get(link);

    const reply = Array.isArray(res.data.response)
      ? res.data.response[0]
      : res.data.response;

    if (!global.client.handleReply) global.client.handleReply = [];

    return api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "sahu"
        });
      },
      event.messageID
    );

  } catch {
    return api.sendMessage("🙂 একটু পরে আবার বলো", event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({ api, event });
};
