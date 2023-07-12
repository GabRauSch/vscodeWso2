/*-------------------------------------
|	NOT AN OFICIAL PRODUCT FROM WSO2    |
---------------------------------------*/
import * as vscode from 'vscode';
import * as message from './initialize/messages'
import * as listeners from './initialize/listeners';
import * as mediators from './builders/mediators/setMediators';
import * as commands from './commands/commands';
import * as complete from './commands/autocomplete'

export function activate(context: vscode.ExtensionContext) {
	message.initializeQuestion()
	listeners.startAll()	
	mediators.getWsoMediatorsValues()

	context.subscriptions.push(...complete.autocompleteProviders(), commands.registryCommand);
}

