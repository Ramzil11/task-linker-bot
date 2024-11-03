import { Composer} from "grammy";
import { MyContext } from "..";
import { Integration, Trello } from "../types";

export const trelloBot = new Composer<MyContext>();
trelloBot.command("trello", async (ctx) => {
    if(ctx.session.trello==null){
        await ctx.reply("У вас не подключена данная интеграция")
        return;
    }
    ctx.session.defaultIntegration=Integration.trello
    await ctx.reply("Trello установлен в качестве дефолтной интеграции")
});

trelloBot.command("tconnect", async (ctx) => {
    const items = ctx.match;
    const trelloParm=formatingKeys(items)
    if(trelloParm==null){
        await ctx.reply("Не верно переданы данные. Попробуйте еще раз (пример /tconnect token,key,columnId)")
        return;
    }
    ctx.session.trello=trelloParm!;
    ctx.session.defaultIntegration=Integration.trello;
    await ctx.reply("Trello подключен")
});
trelloBot.command("tdelete", async (ctx) => {
    ctx.session.trello=undefined;
    ctx.session.defaultIntegration=undefined;
    await ctx.reply("Интеграция Trello удалена")
});

function formatingKeys(items: string): Trello | null {
    try{
        const keyArray = items.split(',');

        if (keyArray.length < 3) {
            return null;
        }
        const [token, key, columnId] = keyArray.map(value => value.replace(/[ <>,\"']/g, ''));
        if (!token || !key || !columnId) {
            return null;
        }
        const trello: Trello = {
            token,
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