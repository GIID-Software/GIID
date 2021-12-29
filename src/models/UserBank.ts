import { Snowflake } from "discord.js"

export class UserBank {
  id: number
  userId: Snowflake
  balance: number
  lastDaily: Date
}
