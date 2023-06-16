import * as fs from 'fs-extra'
import * as vscode from 'vscode'
import {wso2Mediators} from './wso2mediators'

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
    if(dir.indexOf("\\src\\main\\synapse-config\\api") > -1)
        return 'api' 
    if(dir.indexOf("\\src\\main\\synapse-config\\sequence") > -1)
        return 'sequence'
    if(dir.indexOf("\\src\\main\\synapse-config\\local-entries") > -1)
        return 'local-entries'
    if(dir.indexOf("\\src\\main\\synapse-config\\message-processors") > -1)
        return 'message-processors'
    if(dir.indexOf("\\src\\main\\synapse-config\\message-stores") > -1)
        return 'message-stores'
    if(dir.indexOf("\\src\\main\\synapse-config\\tasks") > -1)
        return 'tasks'
    if(dir.indexOf("\\src\\main\\synapse-config\\templates") > -1)
        return 'templates'

    return 'Desconhecido'
}

export const listApis = (basedir: string)=>{
    //
}

export const listSequences = ()=>{
    //
}