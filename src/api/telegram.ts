import { File } from "grammy/types";
import fetch, { Response } from "node-fetch";

export class TelegramApi {
    baseUrl='https://api.telegram.org'
    token: string;
    constructor(token: string) {
        this.token = token;
    }
    async downloadFetch(filePath:string):Promise<Response>{
        try{
            const response = await fetch(`${this.baseUrl}/file/bot${this.token}/${filePath}`) 
            if(response.ok){
                return response
            }
            throw new Error(`Error fetch telegram: ${response.statusText}`)
        }
        catch(e){
            console.log(`TelegramApi.downloadFetch: ${e}`)
            console.log(e)
            throw e
        }
    }
    async fileToFromDate(file:File,caption:string|undefined):Promise<FormData>{
        try{
            const response =await this.downloadFetch(file.file_path!)
            const bufferArray = await response.arrayBuffer()
            const blob = new Blob([bufferArray], { type: 'application/json' })
            const formData = new FormData();
            if(caption!=undefined){
                formData.append('name', caption);
            }
            formData.append('fileSource', blob, file.file_path!.split('/')[1]);
            return formData;
        } catch (e) {
          console.error(`TelegramApi.fileToFromDate: ${e}`);
          throw e
        }
    }
}
