import { Composer} from "grammy";
import { MyContext } from "..";
import { TrelloApi } from "../api/treallo";
import { Integration } from "../types"

export const messageFileListiner = new Composer<MyContext>();

messageFileListiner.on('message:file', async (ctx)=>{
    if(ctx.session.defaultIntegration==Integration.trello && ctx.session.trello){
        const file=await ctx.getFile();
        const trelloApi=new TrelloApi(ctx.session.trello.token,ctx.session.trello.key);
        if(file.file_path!=null){
        const fromData=await ctx.telegramApi.fileToFromDate(file,ctx.message.caption);
        if(ctx.session.defaultIntegration==Integration.trello){
            const res=await trelloApi.createCard(ctx.session.trello.columnId,null,null,fromData);
            if(!res) ctx.reply(`Произошла ошибка при создании задачи в ${ctx.session.defaultIntegration}`)
            ctx.reply(`Задача успешно создана в ${ctx.session.defaultIntegration}`)
        }
        return;
        }
    }
  })