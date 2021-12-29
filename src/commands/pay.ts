import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, User } from 'discord.js'
import { Command } from '../classes/Command'
import { Database } from '../classes/Database'
import { UserBank } from '../entities/UserBank'

export default new Command({
  name: 'pay',
  description: 'Pay someone money!',
  usage: 'pay <user> <amount>',
  aliases: [],
  enabled: false,
  guildOnly: true,
  ownerOnly: false,
  permissions: [],
  // @ts-ignore
  slashCommand: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay someone money!')
    .addUserOption((input) => {
      return input
        .setName('user')
        .setDescription('The user to pay')
        .setRequired(true)
    })
    .addNumberOption((input) => {
      return input
        .setName('amount')
        .setDescription('The amount to pay')
        .setRequired(true)
    }),
  run: async (message, interaction) => {
    if (interaction) {
      let user = interaction.member as GuildMember
      let secondUser = interaction.options.getUser('user')
      let amount = interaction.options.getNumber('amount')

      return pay(user, secondUser, amount)
    }
    if (message) {
      let user = message.member as GuildMember
      let secondUser = message.mentions.users.first()
      let amount = message.content.split(' ')[2]

      // convert amount to number
      if (amount) {
        let newAmount = Number(amount)
        if (!isNaN(newAmount)) {
          return pay(user, secondUser, newAmount)
        } else {
          return "You can't pay someone a non-number."
        }
      } else {
        if (amount === '') {
          return "You can't pay someone nothing."
        }
      }
    }
    return 'An error occured.'
  }
})

async function pay(
  user: GuildMember | null,
  secondUser: User | null | undefined,
  amount: number | null
): Promise<string> {
  if (!user || !secondUser) {
    return 'An error occured.'
  }

  if (user.id === secondUser.id) {
    return "You can't pay yourself."
  }

  if (!amount || amount < 0) {
    return "You can't pay someone a negative amount."
  }

  let userBankRepository = Database.connection.getRepository(UserBank)

  // check if user exists in database
  let userBank = await userBankRepository.findOne({ userId: user.id })

  if (!userBank) {
    console.log('User not found in database.')

    return "You can't send money what you dont have."
  }
  // check if user have enough money
  if (userBank.balance < amount) {
    console.log("User doesn't have enough money.")

    return "You can't send money what you don't have."
  }
  // check if second user exist in database
  let secondUserBank = await userBankRepository.findOne({
    userId: secondUser.id
  })
  if (!secondUserBank) {
    // create second user in database
    const secondUserBank = userBankRepository.create({
      userId: secondUser.id,
      balance: amount,
      lastDaily: new Date()
    })
    await userBankRepository.save(secondUserBank)
    await userBankRepository.update(
      { userId: user.id },
      { balance: userBank.balance - amount }
    )
    return `You paid ${secondUser.tag} ${amount}$`
  } else {
    await userBankRepository.update(
      { userId: user.id },
      { balance: userBank.balance - amount }
    )
    // update second user balance
    await userBankRepository.update(
      { userId: secondUser.id },
      { balance: secondUserBank.balance + amount }
    )
    return `You paid ${secondUser.tag} ${amount}$`
  }

  return 'An error occured. Please try again. If this error still occurs, contact the bot owner.'
}
