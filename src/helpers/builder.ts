import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import * as xmlReader from 'xml2js'
import * as pluralize from 'pluralize'
import path from 'path';
import * as prettier from 'prettier';
import { variablesObject } from './configVariablesObject';
let workspaceFolders = vscode.workspace.workspaceFolders;
let workspaceFolder = '';
if (workspaceFolders && workspaceFolders.length > 0) {
    workspaceFolder = workspaceFolders[0].uri.fsPath;
} 


export const wso2Objectbase = {
    api: [],
    sequence: []
}

export const createPropertiesPattern = ()=>{
    let data = "";    
    variablesObject.resources.forEach((resource)=>{
        data += 
`\t\t<${variablesObject.groupId}.${pluralize.singular(resource.resource)}_._${resource.finalResourceName}>capp/EnterpriseServiceBus</${variablesObject.groupId}.${pluralize.singular(resource.resource)}_._${resource.finalResourceName}>\n`               
    })

    return data
}

export const createDependenciesPattern = ()=>{ 
    let data = "";
    variablesObject.resources.forEach((resource)=>{        
        data +=
`\t\t<dependency>
\t\t\t<groupId>${variablesObject.groupId}.${pluralize.singular(resource.resource)}</groupId>
\t\t\t<artifactId>${resource.finalResourceName}</artifactId>
\t\t\t<version>1.0.0</version>
\t\t\t<type>xml</type>
\t\t</dependency>\n`
    })
    return data
}

export const getConnectorRegistry = (resource: any[])=>{
    let resourcesPath = workspaceFolder + '\\crmIntegrationConnectorExporter\\'
    let resources: any = fs.readdirSync(resourcesPath,);
    
    const trash: string[] = [".classpath", ".meta", ".project", ".settings", "artifact.xml", "pom.xml"];
    const filteredResources: string[] = resources.filter((item: string) => !trash.includes(item));
    
    filteredResources.forEach((resource: string)=> {
        let finalResourceName = resource.split('.')[0] 
        variablesObject.resources.push({finalResourceName, resource: 'resource', resourceFile: resource})               
    });
}

export const createArtifact = (resources: any[])=>{
    let data = "";
    resources.forEach((resource)=>{
        data += 
`\t<artifact name="${resource.finalResourceName}" groupId="${variablesObject.groupId}.${resource.resource}" version="1.0.0" type="synapse/${resource.resource}" serverRole="EnterpriseServiceBus">
\t\t<file>src/main/synapse-config/${resource.resource}/${resource.resourceFile}</file>
\t</artifact>\n`
    })
    return data
}

export const createResource: any = {
    api: (documentation?: any)=>{
        let nameWVersion = documentation.name?.replace('.xml', '');
        let name = nameWVersion.replace('_v1', '');
        let context = name.replace('API', '');
    
        let api = 
`<?xml version="1.0" encoding="UTF-8"?>
<api context="/${context ? context.toLowerCase() : ''}" name="${name}" xmlns="http://ws.apache.org/ns/synapse">
    <resource methods="GET" uri-template="/">
        <inSequence>
            <log level="custom">
                <property name="entrando na API" value="/"/>
            </log>
            <respond/>
        </inSequence>
        <outSequence/>
        <faultSequence/>
    </resource>
</api>`
    
    
        return api
    },
    sequence: (documentation: any)=>{
        let nameWVersion = documentation.name?.replace('.xml', '');
        let sequence = 
`<?xml version="1.0" encoding="UTF-8"?>
<sequence name="${nameWVersion}" trace="disable" xmlns="http://ws.apache.org/ns/synapse">

</sequence>`
    return sequence
    },
    templates: (documentation: any)=>{
        let nameWVersion = documentation.name?.replace('.xml', '');
        let sequence = 
`<?xml version="1.0" encoding="UTF-8"?>
<template name="${nameWVersion}" xmlns="http://ws.apache.org/ns/synapse">
    <parameter defaultValue="" isMandatory="false" name="origin"/>

</sequence>`
    return sequence
    }
}

export const createDataService = (documentation: any)=>{
//
}

export const createMessageProcessor = (documentation: any)=>{
//
}

export const createLocalEntry = (documentation: any)=>{
//
}

export const createXslt = (documentation: any)=>{
//
}

export const createDocumentation = (documentation: any)=>{

}

export const appendDocumentation = (file: string, type: string)=>{

    let documentationFolder = workspaceFolder + '\\ExtraResources';

    if (! fs.existsSync(documentationFolder)){
        createExtraResources(documentationFolder);
    }

    if(! fs.existsSync(documentationFolder + '\\wso2extension.json')){
        createWso2Json(documentationFolder)
    }

    let fileContent = fs.readFileSync(documentationFolder + '\\wso2extension.json').toString()
    let jsonObject = JSON.parse(fileContent)

    
    let nameWVersion = file.replace('.xml', '');
    let name = nameWVersion.replace('_v1', '');

    jsonObject[type].push({
        name,
        file
    });


    createWso2Json(documentationFolder, jsonObject)
}

export const createExtraResources = (basedir: string)=>{
    fs.mkdir(basedir);
    createWso2Json(basedir)
}

export const createWso2Json = (basedir: string, content = wso2Objectbase)=>{
    const rawJson = JSON.stringify(content, null, 2)
    let jsonObject = prettier.format(rawJson, { parser: 'json' });

    fs.writeFile(basedir + '\\wso2extension.json', jsonObject)
}