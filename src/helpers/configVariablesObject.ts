import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import * as xmlReader from 'xml2js'
import * as pluralize from 'pluralize'
import path from 'path';
import * as prettier from 'prettier'

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
    artifacts: object[],
    registry: object[],
    connectorRegistry: object[]
}

export const variablesObject: VariablesObject = {
    artifactId:"teste",
    name: 'teste',
    description: 'teste',
    groupId: "br.com.intelbras.crm",
    resources: [],
    artifacts: [],
    registry: [],
    connectorRegistry: []
}

export const createVariablesObject = (root?: string) =>{

    getContentFromSynapseConfig()
    getContentFromResources()

    return variablesObject;
}

const normalizeName = (name: string) =>{
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
    let resourcesPath = workspaceFolder + '\\crmIntegrationConfigs\\src\\main\\synapse-config'
    let resources: any = fs.readdirSync(resourcesPath);

    resources.forEach((resource: string)=> {
        let resourceName = normalizeName(resource)

        let folderPath = resourcesPath + '\\' + resource;
        let resourceItem = fs.readdirSync(folderPath)

        resourceItem.forEach((resourceFile)=>{
            let xmlFile = fs.readFileSync(folderPath + '\\' + resourceFile)
            xmlReader.parseString(xmlFile, (err, result)=>{
                let finalResourceName: string;
                finalResourceName = (result[resourceName].$.key) ? result[resourceName].$.key :  result[resourceName].$.name;
                variablesObject.resources.push({finalResourceName, resource, resourceFile})
            })
        })
    });

}



const getContentFromSynapseConfig = ()=>{
    let resourcesPath = workspaceFolder + '\\crmIntegrationRegistryResources\\'
    let resources: any = fs.readdirSync(resourcesPath);
    
    const trash: string[] = [".classpath", ".meta", ".project", ".settings", "artifact.xml", "pom.xml"];
    const filteredResources: string[] = resources.filter((item: string) => !trash.includes(item));
    
    filteredResources.forEach((resource: string)=> {
        let finalResourceName = resource.split('.')[0] 
        variablesObject.resources.push({finalResourceName, resource: 'resource', resourceFile: resource})               
    });

}