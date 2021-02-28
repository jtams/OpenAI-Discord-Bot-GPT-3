const axios = require("axios");

module.exports.ai = function (message) {
    return new Promise((resolve, reject) => {
        var config = require("../bin/config.json");
        var data = JSON.stringify({
            prompt: `The following is a conversation with an AI assistant named ${config.aiName}. The assistant is helpful, creative and clever.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ${message.content}\n`,
            temperature: 0.9,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ["\n", " Human:", " AI:"],
        });

        var config = {
            method: "post",
            url: process.env.OPENAI_API_URL,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                message.channel.send(response.data.choices[0].text.slice(4));
                resolve();
            })
            .catch(function (error) {
                console.log(error);
                reject();
            });
    });
};
