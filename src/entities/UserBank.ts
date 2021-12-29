import { Snowflake } from "discord.js"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserBank {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: Snowflake

  @Column()
  balance: number

  @Column()
  lastDaily: Date
}
