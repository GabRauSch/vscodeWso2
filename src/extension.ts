/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import * as createCode from './helpers/createCode'
import wso2Mediators from './helpers/wso2mediators'
import * as files from './helpers/findFiles';
import * as builder from './helpers/builder'
import path from 'path'
import * as fs from 'fs-extra'
import * as registry from './helpers/getRegistry'


export function activate(context: vscode.ExtensionContext) {

	initializeQuestion()
	fileCreationEventListener()

	let autoComplete = autocompleteProviders()
	
	context.subscriptions.push(...autoComplete);
}

const initialize = ()=>{
	// verificar existencia de ExtraResources/wso2extension.json
		// criar o arquivo ou dar manutenção nele com base nos arquivos da api, sequence e etc
	// criar o pom.xml com base na extensão
	// criar o artifact.xml com base na extensão
	// preencher a variavel "sequencesArray" e as outras de mesmo estilo
	// preencher properties e dependencies
}

export const pomCreationWarn = async (type: string | undefined, item: string) => {
  const buttonChoice: vscode.MessageItem = {
    title: 'Modificar POM'
  };

  const selectedChoice = await vscode.window.showInformationMessage(
    `criar as informações do pom e artifact par a cração de ${type} ${item}`,
    buttonChoice
  );

  if (selectedChoice === buttonChoice) {
	registry.createPom()
    vscode.window.showInformationMessage("POM modificado com sucesso");
  }
};

const initializeQuestion = async () => {
	const buttonChoice: vscode.MessageItem = {
	  title: 'Inicializar'
	};
  
	const selectedChoice = await vscode.window.showWarningMessage(
	  `Inicilize a extensão`,
	  buttonChoice
	);
  
	if (selectedChoice === buttonChoice) {
		initialize()
	  	vscode.window.showInformationMessage("extensão iniciada com sucesso");
	}
};

export const fileCreationEventListener = ()=>{
	vscode.workspace.onDidCreateFiles(event =>{
		const createdFiles = event.files;

		let fileName = ''
		let type;
        for (const file of createdFiles) {
			
			fileName = path.basename(file.fsPath);
			type = files.getFileType(file.fsPath);
			
			let structure = '';
			switch(type){
				case 'api': 
					structure = builder.createApi({name: fileName, type});
					builder.appendDocumentation(fileName, type)
					break;
			}
			fs.writeFileSync(file.fsPath, structure);
        }
		pomCreationWarn(type, fileName)
	});
}

export const autocompleteProviders = ()=>{
	const provider1 = vscode.languages.registerCompletionItemProvider('xml', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			const salesforceprefix = new vscode.CompletionItem('salesforcerest')
			const wso2prefix = new vscode.CompletionItem('wso2')	

			let completionItems: vscode.CompletionItem[]= []
			wso2Mediators.forEach((el)=>{
				const mediator = new vscode.CompletionItem(el.mediator);
				mediator.insertText = createCode.createWso2Snippet(el.structure)
				completionItems.push(mediator)
			})

			return [
				...completionItems,
				salesforceprefix,
				wso2prefix
			];
		}
	});


	const salesforce = vscode.languages.registerCompletionItemProvider('xml', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('salesforcerest.')) {
					return undefined;
				}

				let salesforcerestItems = ["query", "queryAll", "create", "update", "upsert", "sObjectRows", "sObjectRowsByExternalId", "init"]
				let salesforcerestReturn: vscode.CompletionItem[] = []
				salesforcerestItems.forEach((el)=>{
					let item = new vscode.CompletionItem(el, vscode.CompletionItemKind.Method)
					item.insertText = new vscode.SnippetString(
						`<salesforcerest.${el} config-key="">\n\n</salesforcerest.${el}>`)
						
					salesforcerestReturn.push(item)
				})

				return salesforcerestReturn
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	const wso2 = vscode.languages.registerCompletionItemProvider('xml', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('wso2.')) {
					return undefined;
				}

				let wso2Return: vscode.CompletionItem[] = []
				wso2Mediators.forEach((el)=>{
					let item = new vscode.CompletionItem(el.structure, vscode.CompletionItemKind.Method)
					item.insertText = new vscode.SnippetString(`${el.structure}`)
						
					wso2Return.push(item)
				})

				return wso2Return

			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	return [provider1, wso2, salesforce]
}