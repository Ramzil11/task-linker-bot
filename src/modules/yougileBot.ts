import { Composer } from "grammy";
import { MyContext } from "..";
import { Integration, Yougile } from "../types";

export const yougileBot =  new Composer<MyContext>();

yougileBot.command("yougile", async (ctx) => {
    if(ctx.session.yougile==null){
        await ctx.reply("У вас не подключена данная интеграция")
        return;
    }
    ctx.session.defaultIntegration=Integration.yougile
    await ctx.reply("Yougile установлен в качестве дефолтной интеграции")
});
yougileBot.command("yconnect", async (ctx) => {
    const items = ctx.match;
    const yougileParm=formatingKeys(items)
    if(yougileParm==null){
        await ctx.reply("Не верно переданы данные. Попробуйте еще раз (пример /yconnect key,columnId)")
        return;
    }
    ctx.session.yougile=yougileParm!;
    ctx.session.defaultIntegration=Integration.yougile;
    await ctx.reply("Yougile подключен")
});

yougileBot.command("ydelete", async (ctx) => {
    ctx.session.yougile=undefined;
    ctx.session.defaultIntegration=undefined;
    await ctx.reply("Интеграция Yougile удалена")
});

function formatingKeys(items: string): Yougile | null {
    try{
        const keyArray = items.split(',');

        if (keyArray.length < 2) {
            return null;
        }
        const [key, columnId] = keyArray.map(value => value.replace(/[ <>,\"']/g, ''));
        if (!key || !columnId) {
            return null;
        }

        const trello: Yougile = {
            key,
            columnId
        };
    return trello;
    }
    catch(e){
        console.error(e)
        return null
    }
}
