import { MessageEmbed } from 'discord.js'
import { Database } from '../classes/Database'
import { Feature } from '../classes/Feature'
import { WelcomeLeaveChannel } from '../entities/WelcomeLeaveChannel'

export default new Feature({
  name: 'WelcomeLeave',
  description: 'Sends a welcome message to new members.',
  enabled: true,
  func: (client) => {
    client.on('guildMemberAdd', async (member) => {
      console.log('guilMemberAdd')

      // Get the welcome channel
      let db = Database.connection
      let welcomeChannel = await db.getRepository(WelcomeLeaveChannel).findOne({
        guildId: member.guild.id
      })

      if (!welcomeChannel) {
        return
      }

      let channel = member.guild.channels.cache.get(
        welcomeChannel.welcomeChannelId
      )
      if (!channel) {
        return
      }

      if (channel.type !== 'GUILD_TEXT') {
        return
      }

      let role = member.guild.roles.cache.get(welcomeChannel.roleId)
      console.log(role)

      if (!role) {
        return
      } else {
        member.roles.add(role)
      }

      const embed = new MessageEmbed()
        .setTitle('Welcome to the server!')
        .setDescription(`Welcome to the server, ${member.user.username}!`)
        .setColor('#00ff00')
      // Send welcome message
      channel.send({ embeds: [embed] })
    })

    client.on('guildMemberRemove', async (member) => {
      console.log('guildMemberRemove')

      // Get the welcome channel
      let db = Database.connection
      let welcomeLeaveChannel = await db
        .getRepository(WelcomeLeaveChannel)
        .findOne({
          guildId: member.guild.id
        })

      if (!welcomeLeaveChannel) {
        console.log('no welcomeLeaveChannel')

        return
      }

      let channel = member.guild.channels.cache.get(
        welcomeLeaveChannel.leaveChannelId
      )
      if (!channel) {
        console.log('no channel')

        return
      }

      if (channel.type !== 'GUILD_TEXT') {
        console.log('not text channel')
        return
      }

      const embed = new MessageEmbed()
        .setTitle('Bye, bye!')
        .setDescription(`${member.user.username} left the server.`)
        .setColor('#ff0000')
      // Send welcome message
      channel.send({ embeds: [embed] })
    })
  }
})
