import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember } from 'discord.js'
import { Command } from '../classes/Command'

const ping = new Command({
  name: 'simjoin',
  description: 'Replies with pong!',
  usage: '',
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  slashCommand: new SlashCommandBuilder()
    .setName('simjoin')
    .setDescription('Replies with pong!'),
  run: async (message, interaction) => {
    if (interaction) {
      let member = interaction.member as GuildMember

      member.client.emit('guildMemberAdd', member)

      return 'Join was emited'
    }
    if (message) {
      let member = message.member

      member?.client.emit('guildMemberAdd', member)

      return 'Join was emited'
    }
    return 'An error occured.'
  }
})

export default ping
