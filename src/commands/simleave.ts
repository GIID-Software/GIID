import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember } from 'discord.js'
import { Command } from '../classes/Command'

const ping = new Command({
  name: 'simleave',
  description: 'Replies with pong!',
  usage: '',
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  slashCommand: new SlashCommandBuilder()
    .setName('simleave')
    .setDescription('Replies with pong!'),
  run: async (message, interaction) => {
    if (interaction) {
      let member = interaction.member as GuildMember

      member.client.emit('guildMemberRemove', member)

      return 'Leave was emited'
    }
    if (message) {
      let member = message.member

      member?.client.emit('guildMemberRemove', member)

      return 'Leave was emited'
    }
    return 'An error occured.'
  }
})

export default ping
