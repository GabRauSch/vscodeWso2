import vscode from 'vscode'
import { initialize } from './main';
import * as createRegistry from '../builders/registers/createRegistry'


export const pomCreationWarn = async (type: string | undefined, item: string) => {
    const buttonChoice: vscode.MessageItem = {
      title: 'Modificar POM'
    };
  
    const selectedChoice = await vscode.window.showInformationMessage(
      `criar as informações do pom e artifact para alteração de ${type} ${item}`,
      buttonChoice
    );
  
    if (selectedChoice === buttonChoice) {
      createRegistry.createPom()
      createRegistry.createArtifactSynapse()
    }
  };
  

export const initializeQuestion = async () => {
  const initializeWithPom: vscode.MessageItem = {
    title: "Iniciar e criar o POM"
	}
  
	const selectedChoice = await vscode.window.showWarningMessage(
	  `Inicilize a extensão`,
	  initializeWithPom
	);

	if (selectedChoice === initializeWithPom){
    createRegistry.createPom()
		createRegistry.createArtifactSynapse()
	} 
  initialize()
  vscode.window.showInformationMessage("Extensão iniciada com sucesso")
};

