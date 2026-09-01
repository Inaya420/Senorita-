module.exports.config = {
  name: "FAHAD",
  eventType: ["log:subscribe"],
  version: "3.0.0",
  credits: "FAHAD",
  description: "Short criminal style welcome message"
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  try {
    const addedParticipants =
      event.logMessageData?.addedParticipants || [];

    // Do not send welcome when the bot itself is added
    const botID = api.getCurrentUserID();

    if (
      addedParticipants.some(
        user => user.userFbId == botID
      )
    ) {
      return;
    }

    const msg = `⚠️ NEW MEMBER DETECTED ⚠️

Welcome to the group.
Stay active. Stay respectful.

— FAHAD`;

    return api.sendMessage(msg, threadID);

  } catch (error) {
    console.error("Welcome notification error:", error);
  }
};
