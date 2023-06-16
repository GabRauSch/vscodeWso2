/*-------------------------------------
|	NOT AN OFICIAL PRODUCT FROM WSO2    |
---------------------------------------*/

import * as vscode from 'vscode';
import * as createCode from './helpers/createCode'
import wso2Mediators from './helpers/wso2mediators'
import * as files from './helpers/findFiles';
import * as builder from './helpers/builder'
import path from 'path'
import * as fs from 'fs-extra'
import * as registry from './helpers/getRegistry'
import { workerData } from 'worker_threads';
import { createVariablesObject } from './helpers/configVariablesObject';


export function activate(context: vscode.ExtensionContext) {

	initialize()
	initializeQuestion()
	fileCreationEventListener()
	fileDeleteEventListener()

	let autoComplete = autocompleteProviders()
	
	context.subscriptions.push(...autoComplete);
}

const initialize = ()=>{
	createVariablesObject()
	// verificar existencia de ExtraResources/wso2extension.json
		// criar o arquivo ou dar manutenção nele com base nos arquivos da api, sequence e etc
	// criar o pom.xml com base na extensão
	// criar o artifact.xml com base na extensão
	// preencher a variavel "sequencesArray" e as outras de mesmo estilo
	// preencher properties e dependencies
	
	console.log('Extensão inciada com sucesso')
}

export const pomCreationWarn = async (type: string | undefined, item: string) => {
  const buttonChoice: vscode.MessageItem = {
    title: 'Modificar POM'
  };

  const selectedChoice = await vscode.window.showInformationMessage(
    `criar as informações do pom e artifact para alteração de ${type} ${item}`,
    buttonChoice
  );

  if (selectedChoice === buttonChoice) {
	registry.createPom()
  }
};

const initializeQuestion = async () => {
	const initializeWithPom: vscode.MessageItem = {
		title: "Iniciar e criar o POM"
	}
  
	const selectedChoice = await vscode.window.showWarningMessage(
	  `Inicilize a extensão`,
	  initializeWithPom
	);
	if (selectedChoice === initializeWithPom){
		initialize()
		registry.createPom()
		vscode.window.showInformationMessage("Extensão iniciada com sucesso")
	}
};

export const fileCreationEventListener = ()=>{
	vscode.workspace.onDidCreateFiles(event =>{
		const createdFiles = event.files;

		let fileName = ''
		let type: 'api'|  'sequence' | 'local-entries' | 'message-processors' | 'message-stores' | 'tasks' | 'templates' | 'Desconhecido' = 'api'
		console.log('criação do arquivo')
        for (const file of createdFiles) {
			console.log(file.fsPath)
			fileName = path.basename(file.fsPath);
			type = files.getFileType(file.fsPath);
			
			let structure = '';
			console.log(type)
			structure = builder.createResource[type]({name: fileName, type});
			builder.appendDocumentation(fileName, type)
			fs.writeFileSync(file.fsPath, structure);
        }
		
		console.log('warning devido a criação de', fileName)
		pomCreationWarn(type, fileName)
	});
}

export const fileDeleteEventListener = ()=>{
	vscode.workspace.onDidDeleteFiles(event =>{
		console.log('oi')
		const deletedFiles = event.files;


		console.log(deletedFiles)

		let fileName = ''
		let type;
		console.log('Deleção de arquivo')
        for (const file of deletedFiles) {
			fileName = path.basename(file.fsPath);
			type = files.getFileType(file.fsPath);
        }
		console.log('warning devido a deleção de', fileName)
		pomCreationWarn(type, fileName)
	});
}

export const fileChangeEventListener = ()=>{
	vscode.workspace.onDidRenameFiles(event =>{
		console.log('oi')
		const changedFiles = event.files;

		console.log(changedFiles)

		// console.log(changedFiles)

		// let fileName = ''
		// let type;
		// console.log('Deleção de arquivo')
        // for (const file of changedFiles) {
		// 	fileName = path.basename(file.fsPath);
		// 	type = files.getFileType(file.fsPath);
        // }
		// console.log('warning devido a deleção de', fileName)
		// pomCreationWarn(type, fileName)
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
		'.' 
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
		'.' 
	);

	return [provider1, wso2, salesforce]
}