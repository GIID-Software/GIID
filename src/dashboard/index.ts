import { Client } from "discord.js"
import express from "express"
import path from "path"

export class Dashboard {
  static app = express()

  static start(client: Client) {
    this.app.set("views", path.join(__dirname, "web"))
    this.app.set("view engine", "ejs")

    this.app.get("/", (_req, res) => {
      res.render("index", {
        text: client.user?.username,
      })
    })

    this.app.listen(3000, () => {
      console.log("[DASHBOARD] Listening on port 3000")
    })
  }
}
