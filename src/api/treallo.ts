export class TrelloApi {
    baseUrl='https://api.trello.com/1'
    token: string;
    key: string;
    constructor(token: string, key: string) {
        this.token = token;
        this.key = key;
    }
    private async trelloFetch(url:string,init: RequestInit<RequestInitCfProperties>,queryParams?:URLSearchParams){
        try{
            const urlParms=new URLSearchParams(queryParams)
            urlParms.append('key',this.key)
            urlParms.append('token',this.token)
            const response = await fetch(`${url}?${urlParms}`,init)
            if(response.ok){
                return response.json() as any
            }
            console.log(`${url}?${urlParms}`)
            return null;
        }
        catch(e){
            console.error(`TrelloApi.trelloFetch: ${e}`)
            return null;
        }
    }
    public async createCard(columnId:string,name:string|null,desc:string|null,file?:FormData):Promise<boolean> {
        const params = {
            name:name!=null ? { name } : {},
            desc:desc!=null ? { desc } : {},
        };
        const response = await this.trelloFetch(`${this.baseUrl}/cards`,{
            method: 'POST',
            body: file??JSON.stringify(params),
        },new URLSearchParams({idList:columnId}));

        return response!=null?true:false;
    }
}
