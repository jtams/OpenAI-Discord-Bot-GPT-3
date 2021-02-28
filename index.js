require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const config = require("./bin/config.json");
const client = new Discord.Client();
const mongoose = require("mongoose");
mongoose.connect(process.env.DBLOGIN, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
const User = require("./schemas/user");
const { ai } = require("./src/ai");

client.on("ready", () => {
    console.log("Bot is online");
});

client.on("message", (message) => {
    if (message.author.bot) return;
    if (message.channel.id == config.channelId) {
        if (message.content[message.content.length - 1] == "?") {
            User.findOne({ id: message.author.id }).then((user) => {
                if (user) {
                    if (user.messages > 0 && !user.admin) {
                        ai(message).then(() => {
                            user.messages -= 1;
                            message.channel.send(`You have ${user.messages} queries remaining.`);
                            user.save();
                        });
                    } else {
                        message.channel.send("You're out of messages.");
                    }
                } else {
                    newuser = new User({
                        username: message.author.username,
                        id: message.author.id,
                        messages: 4,
                        admin: false,
                    });
                    newuser.save();
                    ai(message).then(() => {
                        message.channel.send(`You have ${newuser.messages} queries remaining.`);
                    });
                }
            });
        }
    }
    if (message.content == "shutdown") {
        message.channel.send("Shutting Down...");
        message.channel.send("Goodbye");
        setTimeout(() => {
            process.exit(1);
        }, 4000);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
