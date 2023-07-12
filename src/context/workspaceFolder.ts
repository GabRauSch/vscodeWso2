import * as vscode from 'vscode'

const defineWorkspaceFolder = ()=>{
    let workspaceFolders = vscode.workspace.workspaceFolders;
    let workspaceFolder = '';
    if (workspaceFolders && workspaceFolders.length > 0) {
        workspaceFolder = workspaceFolders[0].uri.fsPath;
    } 
    return workspaceFolder
}


export default defineWorkspaceFolder()