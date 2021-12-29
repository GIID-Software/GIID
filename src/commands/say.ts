import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { Command } from '../classes/Command'

const say = new Command({
  name: 'say',
  description: 'Make the bot say something',
  usage: '<message>',
  aliases: ['echo'],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  // @ts-ignore
  slashCommand: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption((option) =>
      option
        .setName('message')
        .setRequired(true)
        .setDescription('The message to say')
    ),
  run: async (message, interaction) => {
    if (interaction) {
      let text = interaction.options.getString('message')

      if (text && text.length > 0) {
        return new MessageEmbed().setTitle(text)
      }
      return 'No message specified'
    }
    if (message) {
      let text = message.content.split(' ').slice(1).join(' ')

      if (text) {
        return new MessageEmbed().setTitle(text)
      }
      return 'No message specified'
    }
    return 'An error occured.'
  }
})

export default say
