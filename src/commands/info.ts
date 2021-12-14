import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import { Command } from "../Command"

const info = new Command({
  name: "info",
  description: "Get info about user, server, channel, or bot.",
  usage: "",
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  // @ts-ignore
  slashCommand: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about user, server, channel, or bot.")
    .addSubcommand((input) => {
      return input
        .setName("user")
        .setDescription("Get info about a user")
        .addUserOption((input) => {
          return input
            .setName("user_data")
            .setDescription("Get info about a user")
            .setRequired(true)
        })
    }),
  run: async (message, interaction) => {
    if (interaction) {
      const user = interaction.options.getUser("user_data")

      if (user) {
        let avatar = user.avatarURL()
        let member = interaction.guild?.members.cache.get(user.id)
        let roles = member?.roles.cache.map((role) => role.id)

        const embed = new MessageEmbed().setTitle("User Info").addFields([
          {
            name: "ID",
            value: user.id,
            inline: true,
          },
          {
            name: "Nickname Or Username",
            value: member?.nickname || user.username,
            inline: true,
          },
          {
            name: "Created At",
            value: user.createdAt.toLocaleString(),
            inline: true,
          },
          {
            name: "Joined At",
            value:
              interaction.guild?.members.cache
                .get(user.id)
                ?.joinedAt?.toLocaleString() || "None",
            inline: true,
          },
          {
            name: "Roles",
            value: roles?.map((role) => "<@&" + role + ">").join(" ") || "None",
            inline: true,
          },
        ])
        if (avatar) {
          embed.setThumbnail(avatar)
        }
        return embed
      } else {
        return "User not found."
      }
    } else if (message) {
      switch (message.content.split(" ")[1]) {
        case "user":
          const user = message.mentions.users.first()

          if (user && message.content.split(" ")[2]?.includes(user.id)) {
            let avatar = user.avatarURL()
            let member = message.guild?.members.cache.get(user.id)
            let roles = member?.roles.cache.map((role) => role.id)

            const embed = new MessageEmbed().setTitle("User Info").addFields([
              {
                name: "ID",
                value: user.id,
                inline: true,
              },
              {
                name: "Nickname Or Username",
                value: member?.nickname || user.username,
                inline: true,
              },
              {
                name: "Created At",
                value: user.createdAt.toLocaleString(),
                inline: true,
              },
              {
                name: "Joined At",
                value:
                  message.guild?.members.cache
                    .get(user.id)
                    ?.joinedAt?.toLocaleString() || "None",
                inline: true,
              },
              {
                name: "Roles",
                value:
                  roles?.map((role) => "<@&" + role + ">").join(" ") || "None",
                inline: true,
              },
            ])
            if (avatar) {
              embed.setThumbnail(avatar)
            }
            return embed
          } else {
            return "User not found."
          }
          break

        default:
          return "Invalid option."
          break
      }
    }
    return "Some error occured."
  },
})

export default info
