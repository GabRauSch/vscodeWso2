import { createVariablesObject, variablesObject } from "../../context/variablesObject";
import { getPomContent, getArtifactContent } from "./getRegistry";
import { findFileOrFolderWith } from "../../devHelpers/files";
import workspaceFolder from "../../context/workspaceFolder";
import * as fs from 'fs';
import * as vscode from 'vscode';
import pluralize from "pluralize";

export const createPom = ()=>{
    createVariablesObject()
    let dependencies = createDependenciesPomPattern()
    let properties = createPropertiesPomPattern();
  
    // console.clear()
    console.log('Criação de pom para ', properties.length, 'items')
    let content = getPomContent(properties, dependencies);
  
    let root = findFileOrFolderWith(workspaceFolder, variablesObject.root);
    let folder = findFileOrFolderWith(root, variablesObject.exporter);
  
    fs.writeFileSync(folder + '\\pom.xml', content)
    
    vscode.window.showInformationMessage("POM modificado com sucesso");
  }
  
  export const createArtifactSynapse = ()=>{
    createVariablesObject();
    let artifacts = createArtifact()
    let content = getArtifactContent(artifacts)
  
    console.log('Criação de pom para ', artifacts.length, 'items')
  
    let folder = findFileOrFolderWith(workspaceFolder, variablesObject.configs)
    fs.writeFileSync(folder + '\\artifact.xml', content)
  
    vscode.window.showInformationMessage("POM modificado com sucesso");
  }

export const createPropertiesPomPattern = ()=>{
    let data = "";    
    variablesObject.resources.forEach((resource)=>{
        data += 
`\t\t\t<${pluralize.singular(resource.resource)}_._${resource.finalResourceName}>capp/EnterpriseServiceBus</${variablesObject.groupId}.${pluralize.singular(resource.resource)}_._${resource.finalResourceName}>\n`               
    })

    return data
}



export const createDependenciesPomPattern = ()=>{ 
    let data = "";
    variablesObject.resources.forEach((resource)=>{        
        data +=
`\t\t<dependency>
\t\t\t<groupId>${pluralize.singular(resource.resource)}</groupId>
\t\t\t<artifactId>${resource.finalResourceName}</artifactId>
\t\t\t<version>1.0.0</version>
\t\t\t<type>xml</type>
\t\t</dependency>\n`
    })
    return data
}

export const createArtifact = ()=>{
    let data = "";
    variablesObject.resources.forEach((resource)=>{
        data += 
`\t<artifact name="${resource.finalResourceName}" groupId="${variablesObject.groupId}.${resource.resource}" version="1.0.0" type="synapse/${resource.resource}" serverRole="EnterpriseServiceBus">
\t\t<file>src/main/synapse-config/${resource.resource}/${resource.resourceFile}</file>
\t</artifact>\n`
    })
    return data
}