import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, Snowflake } from 'discord.js'
import { Command } from '../classes/Command'
import { Database } from '../classes/Database'
import { UserBank } from '../entities/UserBank'

export default new Command({
  name: 'balance',
  description: 'Check your balance.',
  usage: '',
  aliases: ['bal'],
  enabled: false,
  guildOnly: false,
  ownerOnly: false,
  permissions: [],
  // @ts-ignore
  slashCommand: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance.')
    .addUserOption((input) => {
      return input.setName('user_data').setDescription('Check your balance.')
    }),
  run: async (message, interaction) => {
    if (interaction) {
      let userFromInstance = interaction.options.getUser('user_data')
      let messageAuthor = interaction.member as GuildMember | null
      let user = userFromInstance || messageAuthor?.user
      if (user) {
        return balance(user.id, user.tag)
      }
    }
    if (message) {
      return `Message type command is not supported. ${message.author.tag}`
    }
    return 'An error occured.'
  }
})

async function balance(user: Snowflake, userTag: string): Promise<string> {
  let userBankRepository = Database.connection.getRepository(UserBank)
  let userBank = await userBankRepository
    .findOneOrFail({
      userId: user
    })
    .catch((error) => {
      console.log(error)

      return `${userTag} has no balance.`
    })

  if (userBank && typeof userBank !== 'string') {
    console.log(userBank)

    return `${userTag} has ${userBank.balance} coins.`
  } else {
    return `${userTag} has no coins.`
  }

  return 'An error occured.'
}
