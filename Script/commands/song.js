const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json",
    { timeout: 15000 }
  );
  return res.data.api;
};

module.exports.config = {
  name: "song",
  version: "3.0.0",
  aliases: ["music", "play"],
  credits: "dipto",
  countDown: 5,
  hasPermssion: 0,
  description: "Search and download song directly",
  category: "media",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "{pn} <song name>"
};

module.exports.run = async ({ api, args, event }) => {
  const keyWord = args.join(" ").trim();

  if (!keyWord) {
    return api.sendMessage(
      "Please enter a song name.\nExample: /song Chipi Chipi Chapa Chapa",
      event.threadID,
      event.messageID
    );
  }

  let tempFile = `song_${event.senderID}_${Date.now()}.mp3`;

  try {
    const base = await baseApiUrl();

    const searchRes = await axios.get(
      `${base}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`,
      { timeout: 20000 }
    );

    const result = searchRes.data;

    if (!Array.isArray(result) || result.length === 0) {
      return api.sendMessage(
        `No song found for: ${keyWord}`,
        event.threadID,
        event.messageID
      );
    }

    // Take the first search result directly
    const selected = result[0];

    const downloadRes = await axios.get(
      `${base}/ytDl3?link=${encodeURIComponent(selected.id)}&format=mp3`,
      { timeout: 30000 }
    );

    const { title, downloadLink, quality } = downloadRes.data;

    if (!downloadLink) {
      throw new Error("Download link was not found.");
    }

    await downloadFile(downloadLink, tempFile);

    await api.sendMessage(
      {
        body: `Title: ${title || selected.title}\nQuality: ${quality || "MP3"}`,
        attachment: fs.createReadStream(tempFile)
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.error("SONG ERROR:", error.message);

    api.sendMessage(
      "Sorry, I couldn't download this song right now.",
      event.threadID,
      event.messageID
    );

  } finally {
    setTimeout(() => {
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {}
      }
    }, 15000);
  }
};

async function downloadFile(url, filePath) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 60000,
    maxContentLength: 50 * 1024 * 1024,
    maxBodyLength: 50 * 1024 * 1024
  });

  fs.writeFileSync(filePath, Buffer.from(response.data));
}
