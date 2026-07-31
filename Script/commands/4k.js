module.exports.config = {
  name: "4k",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU" //Credit Change Korben na✅
  description: "Enhance any image to 4K",
  commandCategory: "image",
  usages: "[imageUrl]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const FormData = require("form-data");

  const repliedUrl = event.messageReply?.attachments?.[0]?.url;
  const imageUrl = args[0] || repliedUrl;

  if (!imageUrl) {
    return api.sendMessage(
      "Please provide an image URL or reply to a photo.",
      event.threadID,
      event.messageID
    );
  }

  let processingMsg;
  try {
    processingMsg = await api.sendMessage(
      "⌛ Processing your image...",
      event.threadID
    );

    const form = new FormData();
    form.append("imageUrl", imageUrl);
    form.append("type", "4K");

    const { data } = await axios.post("https://imageforge-ai.onrender.com/api/upscale", form, {
      headers: form.getHeaders(),
      timeout: 60000
    });

    if (!data.status) {
      if (processingMsg?.messageID) {
        await api.unsendMessage(processingMsg.messageID);
      }
      return api.sendMessage("Failed: " + data.error, event.threadID, event.messageID);
    }

    const stream = (await axios.get(data.result.after, { responseType: "stream" })).data;

    if (processingMsg?.messageID) {
      await api.unsendMessage(processingMsg.messageID);
    }

    return api.sendMessage(
      {
        body: `✅ Image Enhanced\n\n🖼️ Type: ${data.type}\n⏱️ Time: ${data.processing}`,
        attachment: stream
      },
      event.threadID,
      event.messageID
    );
  } catch (err) {
    if (processingMsg?.messageID) {
      await api.unsendMessage(processingMsg.messageID);
    }
    return api.sendMessage(
      "Enhancement failed. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};
