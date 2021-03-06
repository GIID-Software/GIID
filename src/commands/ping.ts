import { SlashCommandBuilder } from '@discordjs/builders'
import { Client } from 'discord.js'
import { Command } from '../classes/Command'

const ping = new Command({
  name: 'ping',
  description: 'Replies with pong!',
  usage: '',
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  slashCommand: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  run: async (message, interaction) => {
    if (interaction) {
      let client: Client
      client = interaction.client
      let ms = client.ws.ping
      return 'Pong! ' + Math.round(ms) + 'ms'
    }
    if (message) {
      let client: Client
      client = message.client
      let ms = client.ws.ping
      return 'Pong! ' + Math.round(ms) + 'ms'
    }
    return 'An error occured.'
  }
})

export default ping
