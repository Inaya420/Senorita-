module.exports.handleEvent = async function ({
  api,
  event,
  Users
}) {
  try {
    const raw = event.body ? event.body.trim() : "";

    if (!raw) return;

    // Bot command হলে এখানে reply করবে না
    if (
      raw.startsWith("/") ||
      raw.startsWith("!") ||
      raw.startsWith(".")
    ) {
      return;
    }

    const senderName = await Users.getNameUser(event.senderID);
    const simsim = await getMainAPI();

    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(raw)}&senderName=${encodeURIComponent(senderName)}`,
      {
        timeout: 15000
      }
    );

    const replies = Array.isArray(res.data.response)
      ? res.data.response
      : [res.data.response];

    for (const rep of replies) {
      if (!rep) continue;

      await new Promise(resolve => {
        api.sendMessage(
          rep,
          event.threadID,
          (err, info) => {
            if (!err && info && global.client.handleReply) {
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "simsimi"
              });
            }

            resolve();
          },
          event.messageID
        );
      });
    }

  } catch (err) {
    console.log("Baby Event Error:", err.message);
  }
};
