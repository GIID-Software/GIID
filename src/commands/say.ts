import { SlashCommandBuilder } from "@discordjs/builders"
import { Command } from "../Command"

const say = new Command({
  name: "say",
  description: "Make the bot say something",
  usage: "",
  aliases: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  slashCommand: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something"),
  run: async (message, interaction) => {
    if (interaction) {
      let text = interaction.options.getString("message")
      console.log(text)

      if (text) {
        interaction.reply({
          content: text,
        })
      }
    }
    if (message) {
      let text = message.content.split(" ").slice(1).join(" ")
      message.reply(text)
    }
    return "Some error occured."
  },
})

export default say