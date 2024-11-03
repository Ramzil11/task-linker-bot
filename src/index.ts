import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";
import { D1Adapter } from "@grammyjs/storage-cloudflare";
import { SessionData } from "./types";
import { trelloBot } from "./modules/trelloBot";
import { yougileBot } from "./modules/yougileBot";
import {TelegramApi } from "./api/telegram";
import { errorMiddleware } from "./utils/erorr";
import { messageListiner } from "./listeners/messageListener";
import { voiceListiner } from "./listeners/voiceListener";
import { messageFileListiner } from "./listeners/messageFileListener";
export type MyContext = Context & SessionFlavor<SessionData> & {env:Env,telegramApi:TelegramApi};
export default {
    async fetch(request: Request, env: Env): Promise<Response> {

      const bot = new Bot<MyContext>(env.SECRET_TELEGRAM_API_TOKEN);

      const grammyD1StorageAdapter = await D1Adapter.create<SessionData>(env.DB, 'BotSessions')      

      bot.use(session({
        initial:():SessionData=>{return {countCreateTask:0,isAdmin:false}},
        storage: grammyD1StorageAdapter,
      }))

      bot.use(async (ctx, next) => {
        ctx.env = env;
        ctx.telegramApi=new TelegramApi(env.SECRET_TELEGRAM_API_TOKEN)
        await next();
      });

      await bot.api.setMyCommands([
        { command: "start", description: "Запуск бота" },
        { command: "help", description: "Доступные команды" },
        { command: "settings", description: "Настройки интеграций" },
      ]);

      bot.command("start", async (ctx) => {
        const msg=await ctx.reply(`Привет! Я Jarvis, ваш помощник. Я был создан, чтобы облегчить жизнь людям 😊. Чтобы узнать, как я могу вам помочь, просто введите команду /help.`);
        await ctx.pinChatMessage(msg.message_id)
      })

      bot.command("help", async (ctx) => {
        await ctx.reply("Я могу создавать задачи в таких сервисах, как Yougile и Trello. Чтобы настроить интеграции, перейдите в раздел настроек: /settings\n\nКоманды для Trello:\n/tconnect — подключает интеграцию. Необходимы параметры для подключения (<key>, <token> и <columnId>)\n/tdelete — удаляет интеграцию с Trello\n/trello — выбирает Trello в качестве сервиса по умолчанию\n\nКоманды для Yougile:\n/yconnect  — подключает интеграцию. Необходимы параметры для подключения(<key> и <columnId>)\n/ydelete — удаляет интеграцию с Yougile\n/yougile — выбирает Yougile в качестве сервиса по умолчанию",{link_preview_options:{is_disabled:true}});
      });

      bot.command("settings", async (ctx) => {
        if(ctx.session.trello==null && ctx.session.yougile==null){
          await ctx.reply("На данный момент у вас не подключена ни одна интеграция.\nДля подключения Trello потребуется получить <key>, <token> и <columnId>.\nДля подключения Yougile потребуется получить <key> и <columnId>.");
        }
        if(ctx.session.trello!=null) await ctx.reply(`Подключена интеграция c Trello\nkey: \`${ctx.session.trello.key}\`\ntoken: \`${ctx.session.trello.token}\`\ncolumnId: \`${ctx.session.trello.columnId}\`\nЧтобы выбрать Trello как сервис по умолчанию, введите команду /trello.`,{ parse_mode: 'Markdown' });

        if(ctx.session.yougile!=null) await ctx.reply(`Подключенена интеграция c Yougile\nkey: \`${ctx.session.yougile.key}\`\ncolumnId: \`${ctx.session.yougile.columnId}\`\nЧтобы выбрать Yougile как сервис по умолчанию, введите команду /yougile.`,{ parse_mode: 'Markdown' });
      });

      bot.use(trelloBot);

      bot.use(yougileBot);

      bot.use(messageListiner);

      bot.use(voiceListiner);

      bot.use(messageFileListiner);

      return errorMiddleware(request, env,() =>
        webhookCallback(bot, "cloudflare-mod")(request)
      ); 
    },
  }; 
  