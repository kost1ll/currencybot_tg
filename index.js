const {Telegraf} = require('telegraf');
const axios = require('axios');
const cc = require('currency-codes');

const TG_API_TOKEN = process.env.TG_API_TOKEN || '1895362704:AAHTYrfJEzi7nPh2ddtV38EUa9_Lqa5zH80';
const bot = new Telegraf(TG_API_TOKEN);

bot.start((ctx) => {
    return ctx.reply("Приветствую");
});

bot.hears(/^([а-яА-Я0-9-ё]+|[a-zA-Z0-9]+|[0-9]+)$/i, async ctx => {
    const currencyCode = ctx.message.text;
    const currency = cc.code(currencyCode);
    if (!currency) {
        return ctx.reply('Ты, по-моему, перепутал');
    }
    try {
        const currencyObj = await axios.get("https://api.monobank.ua/bank/currency");
        const currencyNum = currencyObj.data.find((cur) => {
            return cur.currencyCodeA.toString() === currency.number;
        });
        if (!currencyNum || !currencyNum.rateBuy || !currencyNum.rateSell) {
            return ctx.reply('Валюты нет в базе, сорян');
        }
        return ctx.replyWithMarkdown(
            `Валюта: *${currency.code}*
Купля: *${currencyNum.rateBuy}*
Продажа: *${currencyNum.rateSell}*
        `
        );
    } catch (err) {
        return ctx.reply(err);
    }
});

bot.startPolling();