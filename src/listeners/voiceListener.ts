import { Composer} from "grammy";
import { MyContext } from "..";
import { parseText } from "../utils/parse"
import { transcriptionOpenAi } from "../api/openAi";
import { createTask } from "../utils/task";

export const voiceListiner = new Composer<MyContext>();

voiceListiner.on('message:voice', async (ctx)=>{
    const file=await ctx.getFile();
    if(file.file_path!=null){
      const response=await ctx.telegramApi.downloadFetch(file.file_path);
      const text=await transcriptionOpenAi(response,ctx.env);
      const ptext=parseText(text);
      await createTask(ctx,ptext.title,ptext.description)
    }
  })