import {
  CacheType,
  Client,
  CommandInteraction,
  Message,
  MessageEmbed,
} from "discord.js"
import { config } from "../config"
import { readdir, statSync } from "fs"
import path from "path"
import { Command } from "./Command"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
export class CommandHandler {
  // #path: string = path.join(config.dir, "commands")
  #name: string
  #run: (
    message: Message | null,
    Interaction: CommandInteraction<CacheType> | null
  ) => Promise<any>
  #aliases: string[] | undefined
  #enabled: boolean
  #guildOnly: boolean
  #ownerOnly: boolean
  command: Command

  static commands: CommandHandler[] = []
  static slashCommands: any[] = []

  private constructor(file: string) {
    const command: Command = require(file).default


    this.#name = command.name
    this.#run = command.run
    this.#aliases = command.aliases
    this.#enabled = command.enabled
    this.#guildOnly = command.guildOnly
    this.#ownerOnly = command.ownerOnly

    this.command = command

    CommandHandler.slashCommands.push(command.slashCommand)

    console.log(`[INFO] Loaded command: ${this.#name}`)
  }

  static registerEventListeners(client: Client) {
    client.on("messageCreate", (message: Message) => {
      if (message.author.bot) return
      CommandHandler.commands.forEach((command) => {
        if (command.#guildOnly && !message.guild) return
        if (command.#ownerOnly && message.author.id !== config.ownerId) return
        if (
          message.content.split(/ /g)[0] == config.prefix + command.#name &&
          command.#enabled
        ) {
          command.#run(message, null).then((result) => {
            if (result) {
              if (typeof result === "string") {
                message.reply({
                  embeds: [
                    new MessageEmbed()
                      .setTitle(result)
                      .setFooter("GIID Software")
                      .setColor("AQUA"),
                  ],
                })
              } else if (typeof result === "object") {
                message.reply({
                  embeds: [result.setFooter("GIID Software").setColor("AQUA")],
                })
              }
            }
          })
        }
        if (command.#aliases) {
          command.#aliases.forEach((alias) => {
            if (
              message.content.split(/ /g)[0] == config.prefix + alias &&
              command.#enabled
            ) {
              command.#run(message, null).then((result) => {
                if (result) {
                  if (typeof result === "string") {
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                          .setTitle(result)
                          .setFooter("GIID Software")
                          .setColor("AQUA"),
                      ],
                    })
                  } else if (typeof result === "object") {
                    message.reply({
                      embeds: [
                        result.setFooter("GIID Software").setColor("AQUA"),
                      ],
                    })
                  }
                }
              })
            }
          })
        }
      })
    })

    client.on("interactionCreate", (interaction) => {
      if (interaction.isCommand()) {
        CommandHandler.commands.forEach((command) => {
          if (command.#guildOnly && !interaction.guild) return
          if (command.#ownerOnly && interaction.user.id !== config.ownerId) return
          if (
            interaction.isCommand() &&
            interaction.commandName === command.#name &&
            command.#enabled
          ) {
            command
              .#run(null, interaction)
              .then((result: string | MessageEmbed | null) => {
                if (result) {
                  if (typeof result === "string") {
                    interaction.reply({
                      embeds: [
                        new MessageEmbed()
                          .setTitle(result)
                          .setFooter("GIID Software")
                          .setColor("AQUA"),
                      ],
                    })
                  } else if (typeof result === "object") {
                    interaction.reply({
                      embeds: [
                        result.setFooter("GIID Software").setColor("AQUA"),
                      ],
                    })
                  }
                }
              })
          }
        })
      }
    })
  }

  static registerSlashCommands(client: Client) {
    const commandsData: any[] = CommandHandler.slashCommands.map((command) =>
      command.toJSON()
    )

    const rest = new REST({ version: "9" }).setToken(config.token)

    client.guilds.cache.forEach((guild) => {
      if (client.user) {
        rest
          .put(Routes.applicationGuildCommands(client.user.id, guild.id), {
            body: commandsData,
          })
          .then(() =>
            console.log("[REST] All slash commands successfully registered")
          )
          .catch(console.error)
      } else {
        console.log("[REST] Could not register slash commands")
      }
    })
  }

  static async load(file: string): Promise<CommandHandler | undefined> {
    if (require(file).default.enabled) {
      const command = new this(file)
      CommandHandler.commands.push(command)
      return command
    }
    return undefined
  }

  private static async readDir(dir: string, client: Client): Promise<void> {
    readdir(dir, async (err, files) => {
      if (err) {
        console.error(err)
        return
      }

      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = statSync(filePath)

        if (stat.isDirectory()) {
          await CommandHandler.readDir(filePath, client)
        } else if (stat.isFile() && file.endsWith(".js")) {
          await CommandHandler.load(filePath)
        }
      }
      console.log(`[INFO] Loaded ${CommandHandler.commands.length} commands`)

      CommandHandler.registerSlashCommands(client)

      CommandHandler.registerEventListeners(client)

      return
    })
  }

  static loadAll(client: Client) {
    CommandHandler.readDir(path.join(config.dir, "commands"), client)
  }
}
