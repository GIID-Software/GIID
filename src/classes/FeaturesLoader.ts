import path from "path"
import fs from "fs"
import { Feature } from "./Feature"
import { Client } from "discord.js"

export class FeaturesLoader {
  static features: Feature[] = []

  static async loadAll(client: Client) {
    const files = fs.readdirSync(path.join(__dirname, "../features"))
    for (const file of files) {
      const filePath = path.join(path.join(__dirname, "../features"), file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        FeaturesLoader.loadAll(client)
      } else if (stat.isFile() && file.endsWith(".js")) {
        FeaturesLoader.load(filePath)
      }
    }
    for (const feature of this.features) {
      feature.func(client)
    }
  }

  static load(file: string) {
    const feature = require(file)
    if (feature) {
      this.features.push(feature.default)
      console.log("[INFO] Loaded feature: " + feature.default.name)
    }
  }
}
