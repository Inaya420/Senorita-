module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "3.0.0",
  credits: "FAHAD",
  description: "Short criminal style welcome"
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  try {
    const addedParticipants =
      event.logMessageData?.addedParticipants || [];

    const botID = api.getCurrentUserID();

    // Bot নিজে group-এ join করলে কোনো message পাঠাবে না
    if (
      addedParticipants.some(
        user => user.userFbId == botID
      )
    ) {
      return;
    }

    // অন্য member join করলে এই short welcome যাবে
    const msg = `⚠️ NEW MEMBER DETECTED ⚠️

Welcome to the group.
Stay active. Stay respectful.

— FAHAD`;

    return api.sendMessage(msg, threadID);

  } catch (error) {
    console.error("Join notification error:", error);
  }
};
