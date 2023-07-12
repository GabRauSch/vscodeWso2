import * as vscode from 'vscode'
import * as message from '../initialize/messages'
import * as fs from 'fs-extra'
import * as log from '../devHelpers/log'
import * as normalizer from '../devHelpers/normalizer'
import path from 'path'
import * as createResources from '../builders/projectResources/main'
import * as files from '../devHelpers/files'

export const fileChangeEventListener = ()=>{
	vscode.workspace.onDidRenameFiles(event =>{
		const changedFiles = event.files;		

		let fileName = ''
		let type;
        for (const file of changedFiles) {
			fileName = path.basename(file.newUri.fsPath);
			type = files.getFileType(file.newUri.fsPath);
        }
		console.log('warning devido a deleção de', fileName)
		message.pomCreationWarn(type, fileName)
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
		message.pomCreationWarn(type, fileName)
	});
}


export const fileCreationEventListener = ()=>{
	vscode.workspace.onDidCreateFiles(event =>{
		const createdFiles = event.files;

		let fileName = ''
		let finalFileName = '';
		let type: 'api'|  'sequence' | 'local-entries' | 'message-processors' | 'message-stores' | 'tasks' | 'templates' | 'Desconhecido' = 'api'

        for (const file of createdFiles) {
			fileName = path.basename(file.fsPath);
			let dirname = path.dirname(file.fsPath)
			type = files.getFileType(file.fsPath);
			
			let structure = '';
			structure = createResources.createResource[type]({name: fileName, type});

			if(! fileName.toLowerCase().includes(type.toLowerCase()) || fileName.charAt(0).toUpperCase() != fileName.charAt(0)){
				// builder.appendDocumentation(fileName, type)
				finalFileName = dirname + '\\' + normalizer.assertFileName(fileName, type)
				fs.createFileSync(file.fsPath)
				fs.renameSync(file.fsPath, finalFileName)
				fs.appendFileSync(finalFileName, structure);
			} else{
				fs.writeFile(file.fsPath, structure)
			}

        }
		log.list(['teste','teste','teste','teste','teste'], 'listeners.ts', 2)
		log.item('warning devido a criação de', fileName)
		message.pomCreationWarn(type, fileName)
	});
}

export const startAll = ()=>{
	fileCreationEventListener()
	fileDeleteEventListener()
	fileChangeEventListener()
}