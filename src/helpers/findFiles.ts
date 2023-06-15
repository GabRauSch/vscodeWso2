import * as fs from 'fs-extra'
import * as vscode from 'vscode'
import {wso2Mediators} from './wso2mediators'
import { createApi } from './builder';

let workspaceFolders = vscode.workspace.workspaceFolders;
let workspaceFolder = '';
if (workspaceFolders && workspaceFolders.length > 0) {
    workspaceFolder = workspaceFolders[0].uri.fsPath;
} 

export const findFileOrFolderWith = (basedir: string, goal: string)=>{
    const folder = fs.readdirSync(basedir);
    let responseFolder = basedir;
    folder.find((el)=>{
        if(el.toLowerCase().includes(goal.trim().toLowerCase()))
            responseFolder += `\\${el}`
    })

    return responseFolder
}

export const getFileType = (dir: string)=>{
    if(dir.indexOf("\\src\\main\\synapse-config\\api") > -1){
        return 'api'
    }
    return 'Desconhecido'
}

export const listApis = (basedir: string)=>{
    //
}

export const listSequences = ()=>{
    //
}