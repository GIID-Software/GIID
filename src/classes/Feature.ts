import { Client } from "discord.js"

export class Feature {
  public name: string
  public description: string
  public enabled: boolean
  public func: (client: Client) => void

  constructor(featureData: {
    name: string
    description: string
    enabled: boolean
    func: (client: Client) => void
  }) {
    this.name = featureData.name
    this.description = featureData.description
    this.enabled = featureData.enabled
    this.func = featureData.func
  }
}
