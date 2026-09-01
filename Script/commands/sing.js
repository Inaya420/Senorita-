const axios = require("axios");

module.exports.config = {
  name: "sing",
  version: "1.0.0",
  author: "SHAHADAT SAHU",
  countDown: 5,
  role: 0,
  shortDescription: "Search song information",
  longDescription: "Searches for a song and gives its information and Bengali summary.",
  category: "music",
  guide: {
    en: "{pn} <song name>"
  }
};

module.exports.run = async function ({ api, event, args }) {
  const song = args.join(" ").trim();

  if (!song) {
    return api.sendMessage(
      "Example: /sing Amaro Porano Jaha Chay",
      event.threadID,
      event.messageID
    );
  }

  try {
    api.sendMessage(
      "Searching for the song...",
      event.threadID,
      event.messageID
    );

    const url =
      "https://itunes.apple.com/search?term=" +
      encodeURIComponent(song) +
      "&entity=song&limit=1";

    const res = await axios.get(url, {
      timeout: 15000
    });

    if (!res.data.results || res.data.results.length === 0) {
      return api.sendMessage(
        "Song not found. Try another song name.",
        event.threadID,
        event.messageID
      );
    }

    const data = res.data.results[0];

    const title = data.trackName || song;
    const artist = data.artistName || "Unknown";
    const album = data.collectionName || "Unknown";
    const release = data.releaseDate
      ? new Date(data.releaseDate).getFullYear()
      : "Unknown";

    const message =
      "SONG FOUND\n\n" +
      "Title: " + title + "\n" +
      "Artist: " + artist + "\n" +
      "Album: " + album + "\n" +
      "Release Year: " + release + "\n\n" +
      "Lyrics er puro text ekhane deya jabe na.\n" +
      "Tumi chaile ei gaaner lyrics-er Bangla meaning/summary pete paro.";

    return api.sendMessage(
      message,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.log(error);

    return api.sendMessage(
      "Song search korte problem hoyeche. Kichukhon por abar try koro.",
      event.threadID,
      event.messageID
    );
  }
};
