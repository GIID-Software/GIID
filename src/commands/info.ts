import { SlashCommandBuilder } from '@discordjs/builders'
import { APIRole } from 'discord-api-types'
import {
  CategoryChannel,
  Guild,
  MessageEmbed,
  NewsChannel,
  Role,
  TextBasedChannel,
  TextChannel,
  User,
  VoiceChannel
} from 'discord.js'
import { Command } from '../classes/Command'

const info = new Command({
  name: 'info',
  description: 'Get info about user, server, channel, or bot.',
  usage: '',
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  // @ts-ignore
  slashCommand: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about user, server, channel, or bot.')
    .addSubcommand((input) => {
      return input
        .setName('user')
        .setDescription('Get info about an user')
        .addUserOption((input) => {
          return input
            .setName('user_data')
            .setDescription('Get info about an user')
            .setRequired(true)
        })
    })
    .addSubcommand((input) => {
      return input.setName('server').setDescription('Get info about a server')
    })
    .addSubcommand((input) => {
      return input
        .setName('role')
        .setDescription('Get info about a role')
        .addRoleOption((input) => {
          return input
            .setName('role_data')
            .setDescription('Get info about a role')
            .setRequired(true)
        })
    }),
  run: async (message, interaction) => {
    if (interaction) {
      let subcommand = interaction.options.getSubcommand(true)

      switch (subcommand) {
        case 'user':
          const user = interaction.options.getUser('user_data')

          return userInfo(user, interaction.guild)
          break

        case 'server':
          const server = interaction.guild
          return serverInfo(server)
          break
        case 'role':
          const role = interaction.options.getRole('role_data')
          return roleInfo(role, interaction.guild)
          break
        default:
          return 'Invalid option. Valid options: user, server, role.'
          break
      }
    } else if (message) {
      switch (message.content.split(' ')[1]) {
        case 'user':
          const user = message.mentions.users.first()
          return userInfo(user, message.guild)
          break

        case 'server':
          const server = message.guild
          return serverInfo(server)
          break

        case 'role':
          const role = message.mentions.roles.first()
          return roleInfo(role, message.guild)
          break

        case 'channel':
          const channel = message.mentions.channels.first()
          return channelInfo(channel)
          break

        default:
          return 'Invalid option. Valid options: user, server, role.'
          break
      }
    }
    return 'An error occured.'
  }
})

export default info

function userInfo(user: User | undefined | null, guild: Guild | null) {
  if (user) {
    let avatar = user.avatarURL()
    let member = guild?.members.cache.get(user.id)
    let roles = member?.roles.cache.map((role) => role.id)

    const embed = new MessageEmbed().setTitle('User Info').addFields([
      {
        name: '» ID',
        value: user.id
      },
      {
        name: '» Nickname Or Username',
        value: member?.nickname || user.username
      },
      {
        name: '» Created At',
        value: user.createdAt.toLocaleString()
      },
      {
        name: '» Joined At',
        value:
          guild?.members.cache.get(user.id)?.joinedAt?.toLocaleString() ||
          'None'
      },
      {
        name: '» Roles',
        value: roles?.map((role) => '<@&' + role + '>').join(', ') || 'None'
      }
      // {
      //   name: "Permissions",
      //   value: member?.permissions.toArray().join(", ") || "None",
      // },
    ])
    if (avatar) {
      embed.setThumbnail(avatar)
    }
    return embed
  }
  return 'User not found.'
}

function serverInfo(guild: Guild | null) {
  if (guild) {
    let avatar = guild.iconURL()
    let roles = guild.roles.cache.map((role) => role.id)
    let owner = guild.members.cache.get(guild.ownerId)
    const embed = new MessageEmbed().setTitle('Server Info')

    if (owner) {
      embed.addField('Owner', owner?.nickname || owner?.user.username, true)
    }
    embed.addFields([
      {
        name: '» ID',
        value: guild.id
      },
      {
        name: '» Name',
        value: guild.name
      },
      {
        name: '» Created At',
        value: guild.createdAt.toLocaleString()
      },
      {
        name: '» Roles',
        value: roles?.map((role) => '<@&' + role + '>').join(' ') || 'None'
      }
    ])
    if (avatar) {
      embed.setThumbnail(avatar)
    }
    return embed
  }

  return 'Server not found.'
}

function roleInfo(
  role: Role | APIRole | null | undefined,
  guild: Guild | null
) {
  if (role && guild) {
    let avatar = guild.iconURL()
    const embed = new MessageEmbed().setTitle('Role Info')

    embed.addFields([
      {
        name: '» ID',
        value: role.id
      },
      {
        name: '» Name',
        value: role.name
      },
      {
        name: '» Color',
        value: role.color.toString()
      },
      {
        name: '» Show in list',
        value: role.hoist + ''
      },
      {
        name: '» Position',
        value: role.position.toString()
      },
      {
        name: '» Is role of bot',
        value: role.managed + ''
      },
      {
        name: '» Is mentionable',
        value: role.mentionable + ''
      }
    ])
    let guildRole = guild.roles.cache.get(role.id)
    if (guildRole) {
      embed.addFields([
        {
          name: '» Created At',
          value: guildRole.createdAt.toLocaleString()
        },
        {
          name: '» Is administrator',
          value: guildRole.permissions.has('ADMINISTRATOR') + ''
        }
      ])
    }
    if (avatar) {
      embed.setThumbnail(avatar)
    }
    return embed
  }

  return 'Role not found.'
}

function channelInfo(channel: TextBasedChannel | undefined) {
  if (
    channel instanceof TextChannel ||
    channel instanceof NewsChannel ||
    channel instanceof VoiceChannel ||
    channel instanceof CategoryChannel
  ) {
    let avatar = channel.guild?.iconURL()
    const embed = new MessageEmbed().setTitle('Channel Info')

    embed.addFields([
      {
        name: '» ID',
        value: channel.id
      },
      {
        name: '» Name',
        value: channel.name
      },
      {
        name: '» Type',
        value: channel.type
      },
      {
        name: '» Created At',
        value: channel.createdAt.toLocaleString()
      },
      {
        name: '» Position in Category',
        value: channel.position.toString()
      },
      {
        name: '» Category',
        value: channel.parent?.name || 'None'
      }
    ])
    if (avatar) {
      embed.setThumbnail(avatar)
    }
    return embed
  }

  return 'Channel not found.'
}
