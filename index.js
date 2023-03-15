require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai")
const { Telegraf } = require("telegraf")
const { message } = require("telegraf/filters")

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(configuration)

bot.start((ctx) =>{
    ctx.reply("Welcome.\n Send me a message to get started")
})

bot.on(message, async(ctx) =>{
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ctx.message.text,
            temperature: 0.4,
            max_tokens: 2000,
            top_p: 1,
        })
        ctx.reply(completion.data.choices[0].text)
    } catch (error) {
        ctx.reply("Something went wrong. Please try again later")
        console.log(error)
    }
})

bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));