module.exports = {
  config: {
    name: "age",
    version: "2.0.0",
    author: "FAHAD",
    hasPermission: 0,
    commandCategory: "utility",
    cooldowns: 5,
    description: "Calculate age, total time and zodiac sign from birth date",
    usage: "[DD/MM/YYYY]",
    dependencies: {
      "moment-timezone": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const axios = require("axios");

    try {
      if (!args[0]) {
        return api.sendMessage(
          "Please provide your birth date in DD/MM/YYYY format\nExample: age 01/04/2006",
          event.threadID
        );
      }

      const input = args[0];
      const dateParts = input.split("/");

      if (dateParts.length !== 3) {
        return api.sendMessage(
          "Invalid date format. Please use DD/MM/YYYY",
          event.threadID
        );
      }

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);

      if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year < 1000 ||
        year > new Date().getFullYear()
      ) {
        return api.sendMessage(
          "Invalid date. Please enter a valid DD/MM/YYYY date.",
          event.threadID
        );
      }

      const birthDate = moment.tz(
        {
          year: year,
          month: month - 1,
          day: day
        },
        "Asia/Dhaka"
      );

      const now = moment.tz("Asia/Dhaka");

      if (!birthDate.isValid()) {
        return api.sendMessage(
          "Invalid date. Please enter a real calendar date.",
          event.threadID
        );
      }

      if (birthDate.isAfter(now)) {
        return api.sendMessage(
          "You can't be born in the future!",
          event.threadID
        );
      }

      const duration = moment.duration(now.diff(birthDate));

      const years = duration.years();
      const months = duration.months();
      const days = duration.days();

      const totalMonths = Math.floor(now.diff(birthDate, "months"));
      const totalDays = Math.floor(now.diff(birthDate, "days"));
      const totalHours = Math.floor(now.diff(birthDate, "hours"));
      const totalMinutes = Math.floor(now.diff(birthDate, "minutes"));
      const totalSeconds = Math.floor(now.diff(birthDate, "seconds"));

      // Zodiac / Rashi
      function getZodiac(day, month) {
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
          return {
            name: "Aries",
            symbol: "♈",
            traits: "Bold, energetic, confident and adventurous"
          };
        }

        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
          return {
            name: "Taurus",
            symbol: "♉",
            traits: "Patient, reliable, practical and determined"
          };
        }

        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
          return {
            name: "Gemini",
            symbol: "♊",
            traits: "Curious, communicative, clever and adaptable"
          };
        }

        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
          return {
            name: "Cancer",
            symbol: "♋",
            traits: "Caring, emotional, loyal and protective"
          };
        }

        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
          return {
            name: "Leo",
            symbol: "♌",
            traits: "Confident, generous, creative and charismatic"
          };
        }

        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
          return {
            name: "Virgo",
            symbol: "♍",
            traits: "Practical, organized, thoughtful and hardworking"
          };
        }

        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
          return {
            name: "Libra",
            symbol: "♎",
            traits: "Balanced, friendly, diplomatic and fair-minded"
          };
        }

        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
          return {
            name: "Scorpio",
            symbol: "♏",
            traits: "Passionate, determined, loyal and mysterious"
          };
        }

        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
          return {
            name: "Sagittarius",
            symbol: "♐",
            traits: "Optimistic, adventurous, honest and freedom-loving"
          };
        }

        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
          return {
            name: "Capricorn",
            symbol: "♑",
            traits: "Disciplined, responsible, ambitious and patient"
          };
        }

        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
          return {
            name: "Aquarius",
            symbol: "♒",
            traits: "Independent, creative, intelligent and original"
          };
        }

        return {
          name: "Pisces",
          symbol: "♓",
          traits: "Kind, imaginative, emotional and compassionate"
        };
      }

      const zodiac = getZodiac(day, month);

      // Profile picture
      const cacheDir = `${__dirname}/cache`;

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const avatarPath = `${cacheDir}/${event.senderID}.jpg`;

      const avatarUrl =
        `https://graph.facebook.com/${event.senderID}/picture` +
        `?width=512&height=512` +
        `&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      let attachment = null;

      try {
        const response = await axios.get(avatarUrl, {
          responseType: "stream",
          timeout: 10000
        });

        const writer = fs.createWriteStream(avatarPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        attachment = fs.createReadStream(avatarPath);
      } catch (avatarError) {
        console.log("Profile picture could not be downloaded.");
      }

      const message = {
        body:
`┏━━━━━━━━━━━━━━━━━━━━❂
┃       AGE CALCULATOR
┣━━━━━━━━━━━━━━━━━━━━❂
┃ Date of Birth: ${day}/${month}/${year}
┃
┃ Current Age:
┃ ${years} Years ${months} Months ${days} Days
┣━━━━━━━━━━━━━━━━━━━━❂
┃        TOTAL TIME
┣━━━━━━━━━━━━━━━━━━━━❂
┃ ${totalMonths} Months
┃ ${totalDays} Days
┃ ${totalHours} Hours
┃ ${totalMinutes} Minutes
┃ ${totalSeconds} Seconds
┣━━━━━━━━━━━━━━━━━━━━❂
┃        ZODIAC SIGN
┣━━━━━━━━━━━━━━━━━━━━❂
┃ ${zodiac.symbol} ${zodiac.name}
┃
┃ Characteristics:
┃ ${zodiac.traits}
┣━━━━━━━━━━━━━━━━━━━━❂
┃ Created by: FAHADS-BOT
┗━━━━━━━━━━━━━━━━━━━━❂`,
        ...(attachment ? { attachment } : {})
      };

      await api.sendMessage(message, event.threadID);

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

    } catch (error) {
      console.error("Error in age command:", error);

      api.sendMessage(
        "An error occurred while processing your request.",
        event.threadID
      );
    }
  }
};
