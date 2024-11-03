import { Composer} from "grammy";
import { MyContext } from "..";
import { parseText } from "../utils/parse";
import { createTask } from "../utils/task";

export const messageListiner = new Composer<MyContext>();

messageListiner.on('message:text', async (ctx)=>{
    const msgText=ctx.message.text;
    if(ctx.session.defaultIntegration== null){
      await ctx.reply("У вас не установлена дефолтная интеграция.\nЧтобы сделать Trello интеграцией по умолчанию, введите команду /trello.\nЕсли хотите установить Yougile в качестве дефолтной интеграции, используйте команду /yougile.");
      return;
    }
    const ptext = parseText(msgText);
    await createTask(ctx,ptext.title,ptext.description)
  })