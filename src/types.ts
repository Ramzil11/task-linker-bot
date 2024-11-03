export interface SessionData {
	trello?:Trello,
    yougile?:Yougile,
    defaultIntegration?:Integration,
    countCreateTask:number,
    isAdmin:boolean
}
export enum Integration{
    trello="trello",
    yougile="yougile"
}

export interface Trello{
    key: string;
    token:string;
    columnId:string;
}
export interface Yougile{
    key:string
    columnId:string
}