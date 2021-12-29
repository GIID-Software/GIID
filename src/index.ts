import { Client, Intents } from "discord.js"
import { config } from "./config.js"
import { CommandHandler } from "./classes/CommandHandler.js"
import { Dashboard } from "./dashboard/index.js"
import { FeaturesLoader } from "./classes/FeaturesLoader.js"

import { Database } from "./classes/Database.js"

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
})

client.on("ready", () => {
  console.log("[INFO] Ready!")

  Dashboard.start(client)

  client.user?.setActivity("bot system.", { type: "WATCHING" })

  CommandHandler.loadAll(client)
  FeaturesLoader.loadAll(client)
  Database.connect()
})

client.login(config.token)
