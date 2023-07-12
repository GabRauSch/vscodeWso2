import * as vscode from 'vscode'
import pluralize from 'pluralize'
export const assertFileName = (fileName: string, fileType: string)=>{
    fileType = normalizeName(fileType)

    console.log(fileType, fileType.normalize())
    let fyleTypePattern = fileType.charAt(0).toUpperCase() + fileType.slice(1); // api --> A+pi

    let fileWTXml = fileName.replace('.xml', '') // abc.xml --> 'abc
    let transformedFile = fileWTXml.charAt(0).toUpperCase() + fileWTXml.slice(1) // abc --> Abc
    
    transformedFile += fyleTypePattern + '.xml'; // abc --> Abc+Api+.xml
    
    console.log('parece que', transformedFile)
    vscode.window.showErrorMessage('Ao criar uma ' + fileType + ' utilize a inicial maiuscula e o nome' + fyleTypePattern)
    return transformedFile
}



export const normalizeName = (name: string) =>{
    const singularName = pluralize.singular(name);
    const nameParts = singularName.split('-');
    const normalizedName = nameParts
    .map((part, index) => {
        return index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
      })
    .join('');
  return normalizedName;
} 
