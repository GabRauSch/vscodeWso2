import * as vscode from 'vscode'
import * as createRegistry from '../builders/registers/createRegistry';
import * as gerRegistry from '../builders/registers/getRegistry';
import * as ctx from '../context/properties';
import { wso2Mediators } from '../builders/mediators/setMediators';
import * as createCode from '../helpers/createCode'

export const autocompleteProviders = ()=>{
	const provider1 = vscode.languages.registerCompletionItemProvider('xml', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			ctx.setProperties()
			const salesforceprefix = new vscode.CompletionItem('salesforcerest')
			const wso2prefix = new vscode.CompletionItem('wso2')	

			let completionItems: vscode.CompletionItem[]= []
			wso2Mediators.forEach((el: any)=>{
				const mediator = new vscode.CompletionItem(el.mediator);
				mediator.insertText = createCode.createWso2Snippet(el.structure)
				completionItems.push(mediator)
			})

			return [
				...completionItems,
				salesforceprefix,
				wso2prefix
			];
		},
		resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken){
			

			return item;
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
				wso2Mediators.forEach((el: any)=>{
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
