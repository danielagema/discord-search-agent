// 💻 Webserver für Replit-URL
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot läuft – alles stabil!");
});

app.listen(3000, () => {
  console.log("🌐 Webserver läuft auf Port 3000");
});

// 🤖 Discord-Bot
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot ist online als ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== allowedChannelId) return;

  const frage = message.content.trim();

  try {
    const placeholder = await message.reply(
      "⏳ Deine Anfrage wird verarbeitet...",
    );

    const response = await axios.post(N8N_WEBHOOK_URL, {
      frage: frage,
      user: message.author.username,
      channel_id: message.channel.id,
    });

    const antwort =
      response.data.output ||
      response.data.antwort ||
      "✅ Anfrage wurde verarbeitet.";

    await message.reply(antwort);
    await placeholder.delete().catch(() => {});
  } catch (error) {
    console.error("❌ Fehler bei der Anfrage:", error.message);
    await message.reply(
      "❌ Es gab ein Problem beim Verarbeiten deiner Anfrage.",
    );
  }
});

client.login(DISCORD_BOT_TOKEN);
