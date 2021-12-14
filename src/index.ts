import { Client, Intents } from "discord.js"
import { config } from "./config.js"
import { CommandHandler } from "./CommandHandler.js"
import { Dashboard } from "./dashboard/index.js"

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
})

client.on("ready", () => {
  console.log("[INFO] Ready!")

  Dashboard.start(client)

  client.user?.setActivity("bot system.", { type: "WATCHING" })

  CommandHandler.loadAll(client)
})

client.login(config.token)
