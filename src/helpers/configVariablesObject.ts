import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import * as xmlReader from 'xml2js'
import * as pluralize from 'pluralize'
import path from 'path';
import * as prettier from 'prettier'
import { findFileOrFolderWith } from './findFiles';

let workspaceFolders = vscode.workspace.workspaceFolders;
let workspaceFolder = '';
if (workspaceFolders && workspaceFolders.length > 0) {
    workspaceFolder = workspaceFolders[0].uri.fsPath;
} 



export type VariablesObject ={
    artifactId: string,
    name: string,
    description: string,
    groupId: string,
    resources: {finalResourceName: string, resource: string, resourceFile: string}[],
    connectorRegistry: object[],
    version: string
}

export const variablesObject: VariablesObject = {
    artifactId:"",
    name: '',
    description: '',
    groupId: "",
    resources: [],
    connectorRegistry: [],
    version: 'v1'
}

export const createVariablesObject = (root?: string) =>{

    variablesObject.resources = [];
    getContentFromSynapseConfig()
    getContentFromResources()

    console.log(variablesObject.resources);

    return variablesObject;
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

const getContentFromResources = ()=>{   
    console.log('Pegando conteudos do resources (transforms, datamappers, etc...)')
    let resourcesPath = findFileOrFolderWith(workspaceFolder, 'RegistryResources')
    let resources: any = fs.readdirSync(resourcesPath);
    
    const trash: string[] = [".classpath", ".meta", ".project", ".settings", "artifact.xml", "pom.xml"];
    const filteredResources: string[] = resources.filter((item: string) => !trash.includes(item));
    
    filteredResources.forEach((resource: string)=> {
        let finalResourceName = resource.split('.')[0] 
        variablesObject.resources.push({finalResourceName, resource: 'resource', resourceFile: resource})               
    });

    console.log('--------- sucesso ---------)') 
}



const getContentFromSynapseConfig = ()=>{
    console.log('Pegando conteudos do Synapse config (APIS, Sequences, etc...)')
    let synapse = '\\src\\main\\synapse-config'
    let resourcesPath = findFileOrFolderWith(workspaceFolder, 'Configs') + synapse
    let resources: any = fs.readdirSync(resourcesPath);

    resources.forEach((resource: string)=> {
        let resourceName = normalizeName(resource)

        let folderPath = resourcesPath + '\\' + resource;

        let resourceItem = fs.readdirSync(folderPath)

        resourceItem.forEach((resourceFile)=>{
            let finalPath = folderPath + '\\' + resourceFile;
            let xmlFile = fs.readFileSync(finalPath)
            if(xmlFile.byteLength != 0){
                xmlReader.parseString(xmlFile, (err, result)=>{
                    let finalResourceName: string;
                    if(result[resourceName].$){
                        finalResourceName = (result[resourceName].$.key) ? result[resourceName].$.key :  result[resourceName].$.name;
                        variablesObject.resources.push({finalResourceName, resource, resourceFile})
                    }
                })
            }
        })
    });

    console.assert('--------- sucesso ---------)')
}