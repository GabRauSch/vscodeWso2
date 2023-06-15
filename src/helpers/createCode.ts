import * as vscode from 'vscode'
export const createWso2Snippet = (structure: string)=>{
    return new vscode.SnippetString(structure);
}