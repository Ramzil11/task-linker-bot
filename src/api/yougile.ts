export class YougileApi {
    baseUrl='https://ru.yougile.com/api-v2'
    key: string;
    constructor(key: string) {
        this.key = key;
    }
    private async yougileFetch(url:string,init: RequestInit<RequestInitCfProperties>,queryParams?:URLSearchParams){
        try{
            init.headers={
                ...init.headers,
                'Authorization': `Bearer ${this.key}`,
            }
            const urlParms=new URLSearchParams(queryParams)
            const response = await fetch(`${url}?${urlParms}`,init)
            if(response.ok){
                return response.json() as any
            }
            return null;
        }
        catch(e){
            console.error(`YougileApi.yougileFetch: ${e}`)
            return null;
        }
    }
    async createTask(text:string,description:string|null,columnId:string):Promise<boolean> {
        const params = {
            title: text,
            columnId: columnId,
            ...(description ? { description } : {}),
        };
        const res=await this.yougileFetch(`${this.baseUrl}/tasks`,{
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(params),
            method:'POST'
        })
        return res!=null?true:false;
    }
}
