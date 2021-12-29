import 'reflect-metadata'
import { Connection, createConnection } from 'typeorm'
import { UserBank } from '../entities/UserBank'
import { WelcomeLeaveChannel } from '../entities/WelcomeLeaveChannel'

export class Database {
  static connection: Connection
  static connect() {
    createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'GIID',
      entities: [UserBank, WelcomeLeaveChannel],
      synchronize: true,
      logging: false
    })
      .then((connection) => {
        console.log('[INFO] Connected to database.')

        Database.connection = connection
      })
      .catch((error) => console.log(error))
  }
}
