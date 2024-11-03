import { MyContext } from "..";
import { TrelloApi } from "../api/treallo";
import { YougileApi } from "../api/yougile";
import { Integration } from "../types";

export async function createTask(ctx:MyContext,text:string,description:string|null){
    const yougileApi=new YougileApi(ctx.session.yougile!.key);
    const trelloApi=new TrelloApi(ctx.session.trello!.token,ctx.session.trello!.key);
    const result=ctx.session.defaultIntegration==Integration.trello?
    await trelloApi.createCard(ctx.session.trello!.columnId,text,description):await yougileApi.createTask(text,description,ctx.session.yougile!.columnId);
    if(result){
      ctx.session.countCreateTask+=1
      ctx.reply(`Задача успешно создана в ${ctx.session.defaultIntegration}`)
      return;
    }
    ctx.reply(`Произошла ошибка при создании задачи в сервисе ${ctx.session.defaultIntegration}`)
}