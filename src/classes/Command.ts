import { SlashCommandBuilder } from "@discordjs/builders"
import {
  CacheType,
  CommandInteraction,
  Message,
  MessageEmbed,
} from "discord.js"

export class Command {
  public readonly name: string
  public readonly description: string
  public readonly usage: string
  public readonly aliases?: string[]
  public readonly enabled: boolean
  public readonly guildOnly: boolean
  public readonly ownerOnly: boolean
  public readonly permissions: string[]
  public readonly run: (
    message: Message | null,
    Interaction: CommandInteraction<CacheType> | null
  ) => Promise<string | MessageEmbed | null | undefined>

  public slashCommand: SlashCommandBuilder

  constructor(commandData: {
    name: string
    description: string
    usage: string
    aliases?: string[]
    enabled: boolean
    guildOnly: boolean
    ownerOnly: boolean
    permissions: string[]

    slashCommand: SlashCommandBuilder
    run: (
      message: Message | null,
      Interaction: CommandInteraction<CacheType> | null
    ) => Promise<string | MessageEmbed | null | undefined>
  }) {
    this.name = commandData.name
    this.description = commandData.description
    this.usage = commandData.usage
    if (commandData.aliases) {
      this.aliases = commandData.aliases
    }
    this.enabled = commandData.enabled
    this.guildOnly = commandData.guildOnly
    this.ownerOnly = commandData.ownerOnly
    this.permissions = commandData.permissions
    this.run = commandData.run
    this.slashCommand = commandData.slashCommand
  }
}
