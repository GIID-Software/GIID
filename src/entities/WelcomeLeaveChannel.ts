import { Snowflake } from 'discord.js'
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity()
export class WelcomeLeaveChannel {
  @Unique(['guildId'])
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  guildId: Snowflake

  @Column()
  welcomeChannelId: Snowflake

  @Column()
  leaveChannelId: Snowflake

  @Column()
  roleId: Snowflake
}
