module.exports.config = {
  name: "FAHAD",
  eventType: ["log:subscribe"],
  version: "2.0.0",
  credits: "FAHAD",
  description: "Short criminal style welcome message",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];

  const joinGifPath = path.join(__dirname, "cache", "joinGif");

  if (!fs.existsSync(joinGifPath)) {
    fs.mkdirSync(joinGifPath, { recursive: true });
  }
};

module.exports.run = async function ({ api, event }) {
  const fs = require("fs-extra");
  const path = require("path");

  const { threadID } = event;
  const botPrefix = global.config.PREFIX || "/";

  try {
    const addedParticipants = event.logMessageData.addedParticipants || [];

    // Bot joined the group
    if (
      addedParticipants.some(
        user => user.userFbId == api.getCurrentUserID()
      )
    ) {
      const botName =
        global.config.BOTNAME || "FAHADS-BOT";

      await api.changeNickname(
        `[ ${botPrefix} ] • ${botName}`,
        threadID,
        api.getCurrentUserID()
      );

      return api.sendMessage(
        `⚠️ NEW MEMBER DETECTED ⚠️

${botName} has entered the group.

Ready to serve.
Enjoy the chaos.

— FAHAD`,
        threadID
      );
    }

    const threadInfo = await api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName || "This Group";
    const participantIDs = threadInfo.participantIDs || [];

    const threadData =
      global.data.threadData.get(parseInt(threadID)) || {};

    let names = [];
    let mentions = [];

    for (const participant of addedParticipants) {
      const name = participant.fullName || "New Member";
      const id = participant.userFbId;

      names.push(name);
      mentions.push({
        tag: name,
        id: id
      });
    }

    const memberNumber = participantIDs.length;

    let msg =
      typeof threadData.customJoin === "undefined"
        ? `⚠️ NEW MEMBER DETECTED ⚠️

Welcome, {name}.
Member #{soThanhVien} has entered the group.

Stay active. Stay respectful.
Enjoy the chaos.

— FAHAD Chat Bot`
        : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, names.join(", "))
      .replace(/\{soThanhVien}/g, memberNumber)
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(
      __dirname,
      "cache",
      "joinGif"
    );

    const files = fs
      .readdirSync(joinGifPath)
      .filter(file =>
        [".mp4", ".jpg", ".jpeg", ".png", ".gif"].some(ext =>
          file.toLowerCase().endsWith(ext)
        )
      );

    let attachment = null;

    if (files.length > 0) {
      const randomFile =
        files[Math.floor(Math.random() * files.length)];

      attachment = fs.createReadStream(
        path.join(joinGifPath, randomFile)
      );
    }

    return api.sendMessage(
      attachment
        ? {
            body: msg,
            attachment,
            mentions
          }
        : {
            body: msg,
            mentions
          },
      threadID
    );
  } catch (error) {
    console.error("Join notification error:", error);
  }
};
