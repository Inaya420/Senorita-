const axios = require("axios");

const apiList =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

async function getMainAPI() {
  const res = await axios.get(apiList, {
    timeout: 15000
  });

  if (!res.data || !res.data.simsimi) {
    throw new Error("Simsimi API URL not found");
  }

  return res.data.simsimi;
}

module.exports.config = {
  name: "baby",
  version: "3.0.0",
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
  "Ami to ekhanei achi, bolo."
];

function getReplies(data) {
  if (!data) return [];

  if (Array.isArray(data.response)) {
    return data.response.filter(Boolean);
  }

  if (typeof data.response === "string" && data.response.trim()) {
    return [data.response];
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return [data.message];
  }

  if (typeof data.reply === "string" && data.reply.trim()) {
    return [data.reply];
  }

  return [];
}

async function sendReplies(api, event, replies) {
  for (const reply of replies) {
    if (!reply) continue;

    await new Promise(resolve => {
      api.sendMessage(
        String(reply),
        event.threadID,
        () => resolve(),
        event.messageID
      );
    });
  }
}

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {
  try {
    const uid = event.senderID;

    let senderName = "User";

    try {
      senderName = await Users.getNameUser(uid);
    } catch (e) {}

    const rawQuery = args.join(" ").trim();

    if (!rawQuery) {
      const reply =
        greetings[Math.floor(Math.random() * greetings.length)];

      return api.sendMessage(
        reply,
        event.threadID,
        event.messageID
      );
    }

    const command = args[0].toLowerCase();
    const simsim = await getMainAPI();

    if (command === "remove" || command === "rm") {
      const text = rawQuery
        .replace(/^(remove|rm)\s*/i, "");

      const parts = text.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "Use: /baby remove [Question] - [Reply]",
          event.threadID,
          event.messageID
        );
      }

      const ask = parts[0].trim();
      const ans = parts.slice(1).join(" - ").trim();

      const res = await axios.get(
        `${simsim}/delete`,
        {
          params: {
            ask,
            ans
          },
          timeout: 15000
        }
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
        {
          timeout: 15000
        }
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
        res.data.message || "Unknown error.",
        event.threadID,
        event.messageID
      );
    }

    if (command === "edit") {
      const text = rawQuery
        .replace(/^edit\s*/i, "");

      const parts = text.split(" - ");

      if (parts.length < 3) {
        return api.sendMessage(
          "Use: /baby edit [Question] - [Old Reply] - [New Reply]",
          event.threadID,
          event.messageID
        );
      }

      const ask = parts[0].trim();
      const oldReply = parts[1].trim();
      const newReply = parts.slice(2).join(" - ").trim();

      const res = await axios.get(
        `${simsim}/edit`,
        {
          params: {
            ask,
            old: oldReply,
            new: newReply
          },
          timeout: 15000
        }
      );

      return api.sendMessage(
        res.data.message || "Done.",
        event.threadID,
        event.messageID
      );
    }

    if (command === "teach") {
      const text = rawQuery
        .replace(/^teach\s*/i, "");

      const parts = text.split(" - ");

      if (parts.length < 2) {
        return api.sendMessage(
          "Use: /baby teach [Question] - [Reply]",
          event.threadID,
          event.messageID
        );
      }

      const ask = parts[0].trim();
      const ans = parts.slice(1).join(" - ").trim();

      let groupName = event.threadName || "";

      try {
        if (!groupName) {
          const threadInfo =
            await api.getThreadInfo(event.threadID);

          if (threadInfo && threadInfo.threadName) {
            groupName = threadInfo.threadName;
          }
        }
      } catch (e) {}

      const params = {
        ask,
        ans,
        senderID: uid,
        senderName,
        groupID: event.threadID
      };

      if (groupName) {
        params.groupName = groupName;
      }

      const res = await axios.get(
        `${simsim}/teach`,
        {
          params,
          timeout: 15000
        }
      );

      return api.sendMessage(
        res.data.message || "Teaching completed.",
        event.threadID,
        event.messageID
      );
    }

    const res = await axios.get(
      `${simsim}/simsimi`,
      {
        params: {
          text: rawQuery,
          senderName
        },
        timeout: 20000
      }
    );

    const replies = getReplies(res.data);

    if (!replies.length) {
      console.log(
        "BABY API RESPONSE:",
        JSON.stringify(res.data)
      );

      return api.sendMessage(
        "Sorry, ekhon reply dite parchi na.",
        event.threadID,
        event.messageID
      );
    }

    await sendReplies(api, event, replies);

  } catch (error) {
    console.error(
      "BABY COMMAND ERROR:",
      error.response?.data || error.message
    );

    return api.sendMessage(
      "Bot er API te problem hocche. Ektu pore abar try koro.",
      event.threadID,
      event.messageID
    );
  }
};


/*
  Normal message auto reply
  Note:
  Eta kaj korar jonno tomar bot framework-e
  handleEvent support thakte hobe.
*/

module.exports.handleEvent = async function ({
  api,
  event,
  Users
}) {
  try {
    const raw = event.body
      ? event.body.trim()
      : "";

    if (!raw) return;

    // Command hole auto reply korbe na
    if (
      raw.startsWith("/") ||
      raw.startsWith("!") ||
      raw.startsWith(".")
    ) {
      return;
    }

    let senderName = "User";

    try {
      senderName =
        await Users.getNameUser(event.senderID);
    } catch (e) {}

    const simsim = await getMainAPI();

    const res = await axios.get(
      `${simsim}/simsimi`,
      {
        params: {
          text: raw,
          senderName
        },
        timeout: 20000
      }
    );

    const replies = getReplies(res.data);

    if (!replies.length) {
      console.log(
        "BABY EVENT API RESPONSE:",
        JSON.stringify(res.data)
      );
      return;
    }

    await sendReplies(api, event, replies);

  } catch (error) {
    console.error(
      "BABY EVENT ERROR:",
      error.response?.data || error.message
    );
  }
};
