import { OpenAI } from "openai";
import { Response } from "node-fetch";

export async function transcriptionOpenAi(response:Response,env:Env):Promise<string>{
    try{
        const openai = new OpenAI({apiKey:env.OPENAI_API_TOKEN});
        const transcription = await openai.audio.transcriptions.create({
            file: response,
            model: "whisper-1",
        });
        console.log(transcription)
        return transcription.text
    }
    catch(e){
        console.log(`transcriptionOpenAi: ${e}`)
        throw e
    }
}