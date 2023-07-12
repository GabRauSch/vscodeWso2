import * as vscode from 'vscode';
import * as registry from '../builders/registers/createRegistry'

export const registryCommand =  vscode.commands.registerCommand('wso2-vscode-extension.generateRegistry', ()=>{
		registry.createPom()
	})