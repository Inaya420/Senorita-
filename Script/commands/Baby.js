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
  name: "baby",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "ULLASH",
  description: "Smart AI Baby Chatbot",
  commandCategory: "Chat",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: true
};

const greetings = [
  "Hmm bolo, ki hoyeche?",
  "Bolo, shunchi to.",
  "Hae bolo, ki niye kotha bolba?",
  "Achha bolo, ki khobor?",
  "Ami achi, bolo.",
  "Hmm, tomar kotha shunchi.",
  "Bolo, ajke ki niye golpo hobe?",
  "Hae bolo.",
  "Ki khobor tomar?",
  "Achha bolo, ki jante chao?",
  "Hmm, ami shunchi. Bolo.",
  "Bolo to, ajker din kemon gelo?",
  "Ki byapar? Eto chupchap keno?",
  "Hae bolo, ki bolte chao?",
  "Achha, shuru koro. Ami shunchi.",
  "Ki niye kotha bolte chao?",
  "Bolo, kono problem hoyeche naki?",
  "Hmm, bolo. Dekhi tomake kivabe help korte pari.",
  "Are bolo na, ki hoyeche?",
  "Ami to ekhanei achi, bolo.",
  "Ki bolbe? Mon diye shunchi.",
  "Hmm, interesting. Bolo!",
  "Achha bolo, golpo kori.",
  "Ki khobor? Sob thikthak to?",
  "Bolo bondhu, ki cholche?",
  "Hae, tomar message peyechi. Bolo.",
  "Ki jante chao? Bolo dekhi!",
  "Hmm bolo to, ki vabcho?",
  "Achha bolo, ami shunchi.",
  "Ki hoyeche? Sob thik ache to?",
  "Bolo, ajke tomar mood kemon?",
  "Hmm, ebar bolo ashol kotha ta ki?",
  "Thik ache, bolo. Ami monojog diye shunchi.",
  "Hae bolo, tomar sathe kotha bolte pari.",
  "Bolo, ki niye help lagbe?",
  "Hmm bolo, ami ready.",
  "Achha, bolo ki scene?",
  "Ki holo? Kichu bolba?",
  "Bolo, ami shuntechi.",
  "Hae, bolo. Ki obostha?"
];

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;

    let senderName = "User";

    try {
      senderName = await Users.getNameUser(uid);
    } catch (e) {}

    const rawQuery = args.join(" ").trim();
    const query = rawQuery.toLowerCase();

    const simsim = await getMainAPI();

    if (!simsim) {
      return api.sendMessage(
        "API পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করো.",
        event.threadID,
        event.messageID
      );
    }

    if (!query) {
      const reply =
        greetings[Math.floor(Math.random() * greetings.length)];

      return api.sendMessage(
        reply,
        event.threadID,
        event.messageID
      );
    }

    const command = args[0].toLowerCase();

    if (["remove", "rm"].includes(command)) {
      const parts = rawQuery
        .replace(/^(remove|rm)\s*/i, "")
        .split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "Use: remove [Question] - [Reply]",
          event.threadID,
          event.messageID
        );
      }

      const [ask, ans] = parts.map(p => p.trim());

      const res = await axios.get(
        `${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`,
        { timeout: 15000 }
      );

      return api.sendMessage(
        res.data.message || "Done.",
        event.threadID,
        event.messageID
      );
    }

    if (command === "list") {
      const res = await axios.get(
        `${simsim}/list`,
        { timeout: 15000 }
      );

      if (res.data.code === 200) {
        return api.sendMessage(
          `Total Questions Learned: ${res.data.totalQuestions}\n` +
          `Total Replies Stored: ${res.data.totalReplies}\n` +
          `Developer: ${res.data.author}`,
          event.threadID,
          event.messageID
        );
      }

      return api.sendMessage(
        `Error: ${res.data.message || "Unknown error"}`,
        event.threadID,
        event.messageID
      );
    }

    if (command === "edit") {
      const parts = rawQuery
        .replace(/^edit\s*/i, "")
        .split(" - ");

      if (parts.length < 3) {
        return api.sendMessage(
          "Use: edit [Question] - [Old Reply] - [New Reply]",
          event.threadID,
          event.messageID
        );
      }

      const [ask, oldReply, newReply] =
        parts.map(p => p.trim());

      const res = await axios.get(
        `${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`,
        { timeout: 15000 }
      );

      return api.sendMessage(
        res.data.message || "Done.",
        event.threadID,
        event.messageID
      );
    }

    if (command === "teach") {
      const parts = rawQuery
        .replace(/^teach\s*/i, "")
        .split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "Use: teach [Question] - [Reply]",
          event.threadID,
          event.messageID
        );
      }

      const [ask, ans] = parts.map(p => p.trim());

      const groupID = event.threadID;

      let groupName = event.threadName || "";

      try {
        if (!groupName && groupID != uid) {
          const threadInfo =
            await api.getThreadInfo(groupID);

          if (threadInfo && threadInfo.threadName) {
            groupName = threadInfo.threadName;
          }
        }
      } catch (e) {}

      let teachUrl =
        `${simsim}/teach?` +
        `ask=${encodeURIComponent(ask)}` +
        `&ans=${encodeURIComponent(ans)}` +
        `&senderID=${encodeURIComponent(uid)}` +
        `&senderName=${encodeURIComponent(senderName)}` +
        `&groupID=${encodeURIComponent(groupID)}`;

      if (groupName) {
        teachUrl +=
          `&groupName=${encodeURIComponent(groupName)}`;
      }

      const res = await axios.get(
        teachUrl,
        { timeout: 15000 }
      );

      return api.sendMessage(
        res.data.message || "Teaching completed.",
        event.threadID,
        event.messageID
      );
    }

    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`,
      { timeout: 20000 }
    );

    let replies = [];

    if (Array.isArray(res.data.response)) {
      replies = res.data.response;
    } else if (res.data.response) {
      replies = [res.data.response];
    } else if (res.data.message) {
      replies = [res.data.message];
    }

    if (!replies.length) {
      return api.sendMessage(
        "Sorry, ekhon reply dite parchi na.",
        event.threadID,
        event.messageID
      );
    }

    for (const rep of replies) {
      if (!rep) continue;

      await new Promise(resolve => {
        api.sendMessage(
          String(rep),
          event.threadID,
          () => resolve(),
          event.messageID
        );
      });
    }

  } catch (error) {
    console.error("BABY COMMAND ERROR:", error);

    return api.sendMessage(
      "Bot er API te problem hocche. Ektu pore abar try koro.",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({
  api,
  event,
  handleReply,
  Users
}) {
  try {
    if (event.senderID !== handleReply.author) {
      return;
    }

    const uid = event.senderID;

    let senderName = "User";

    try {
      senderName = await Users.getNameUser(uid);
    } catch (e) {}

    const query = event.body
      ? event.body.trim().toLowerCase()
      : "";

    if (!query) return;

    const simsim = await getMainAPI();

    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`,
      { timeout: 20000 }
    );

    let replies = [];

    if (Array.isArray(res.data.response)) {
      replies = res.data.response;
    } else if (res.data.response) {
      replies = [res.data.response];
    } else if (res.data.message) {
      replies = [res.data.message];
    }

    if (!replies.length) {
      return api.sendMessage(
        "Sorry, reply dite parchi na.",
        event.threadID,
        event.messageID
      );
    }

    for (const rep of replies) {
      if (!rep) continue;

      await new Promise(resolve => {
        api.sendMessage(
          String(rep),
          event.threadID,
          () => resolve(),
          event.messageID
        );
      });
    }

  } catch (error) {
    console.error("BABY HANDLE REPLY ERROR:", error);

    api.sendMessage(
      "API te problem hocche. Pore abar try koro.",
      event.threadID,
      event.messageID
    );
  }
};
