import { SlashCommandBuilder } from '@discordjs/builders'
import { Guild, GuildChannel, Role } from 'discord.js'
import { Command } from '../classes/Command'
import { Database } from '../classes/Database'
import { WelcomeLeaveChannel } from '../entities/WelcomeLeaveChannel'

const ping = new Command({
  name: 'setwelcomeleave',
  description: 'Set the welcome message for the server.',
  usage: '',
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  // @ts-expect-error
  slashCommand: new SlashCommandBuilder()
    .setName('setwelcomeleave')
    .setDescription('Set current channel for welcome messages.')
    .addChannelOption((option) => {
      return option
        .setName('welcome')
        .setDescription('Set the channel for welcome messages.')
    })
    .addChannelOption((option) => {
      return option
        .setName('leave')
        .setDescription('Set the channel for leave messages.')
    })
    .addRoleOption((option) => {
      return option.setName('role').setDescription('Set the role for autorole')
    }),
  run: async (message, interaction) => {
    if (message) {
      return 'This command can only be used with slash commands.'
    }

    // get Channel
    let welcomeChannel: GuildChannel | null = null
    let leaveChannel: GuildChannel | null = null
    let role: Role | null = null

    if (interaction) {
      welcomeChannel = interaction.options.getChannel(
        'welcome'
      ) as GuildChannel | null

      if (!welcomeChannel) {
        return 'No channel selected'
      }

      if (welcomeChannel.type !== 'GUILD_TEXT') {
        return 'Channel is not a text channel'
      }

      role = interaction.options.getRole('role') as Role | null

      if (!role) {
        return 'No role selected'
      }

      leaveChannel = interaction.options.getChannel(
        'leave'
      ) as GuildChannel | null

      if (!leaveChannel) {
        return 'No channel selected'
      }

      if (leaveChannel.type !== 'GUILD_TEXT') {
        return 'Channel is not a text channel'
      }
    }
    // get Guild
    let guild: Guild | null = null
    if (interaction) {
      guild = interaction.guild
    }

    if (!welcomeChannel || !guild || !leaveChannel || !role) {
      return 'Could not get channel or guild. Please try again. If the problem persists, contact an administrator.'
    }

    // Delete old record in database
    let db = Database.connection

    await db.getRepository(WelcomeLeaveChannel).delete({
      guildId: guild.id
    })

    // Create new record in database
    let welcomeChannelEntity = new WelcomeLeaveChannel()
    welcomeChannelEntity.guildId = guild.id
    welcomeChannelEntity.welcomeChannelId = welcomeChannel.id
    welcomeChannelEntity.leaveChannelId = leaveChannel.id
    welcomeChannelEntity.roleId = role.id

    await db.getRepository(WelcomeLeaveChannel).save(welcomeChannelEntity)

    return `Welcome messages will now be sent to "${welcomeChannel.name}". Leave channel will be set to "${leaveChannel.name}". Role will be set to "${role.name}".`
  }
})

export default ping
