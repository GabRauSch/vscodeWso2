import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import * as xmlReader from 'xml2js'
import * as pluralize from 'pluralize'
import path, { normalize } from 'path';
import * as prettier from 'prettier';
import { normalizeName, variablesObject } from './configVariablesObject';
import { findFileOrFolderWith } from './findFiles';
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
    let resourcesPath = findFileOrFolderWith(workspaceFolder, 'ConnectorExporter')
    let resources: any = fs.readdirSync(resourcesPath,);
    
    const trash: string[] = [".classpath", ".meta", ".project", ".settings", "artifact.xml", "pom.xml"];
    const filteredResources: string[] = resources.filter((item: string) => !trash.includes(item));
    
    filteredResources.forEach((resource: string)=> {
        let finalResourceName = resource.split('.')[0] 
        variablesObject.resources.push({finalResourceName, resource: 'resource', resourceFile: resource})               
    });
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
    },
    'message-stores': (documentation: any)=>{
        let name = documentation.name
        if(name){
            let nameWVersion = name.replace('.xml', '');

            let queue = name.replace('Store', 'Queue')
           
            let messageStore = 
`<?xml version="1.0" encoding="UTF-8"?>
<messageStore class="org.apache.synapse.message.store.impl.jms.JmsStore" name="${nameWVersion}" xmlns="http://ws.apache.org/ns/synapse">
    <parameter name="store.jms.destination">${variablesObject.name}-${queue}</parameter>
    <parameter name="store.jms.username">$SYSTEM:USERNAME_AMQ</parameter>
    <parameter name="store.jms.connection.factory">QueueConnectionFactory</parameter>
    <parameter name="store.producer.guaranteed.delivery.enable">false</parameter>
    <parameter name="store.jms.password">$SYSTEM:PASSWORD_AMQ</parameter>
    <parameter name="store.jms.cache.connection">false</parameter>
    <parameter name="java.naming.factory.initial">org.apache.activemq.jndi.ActiveMQInitialContextFactory</parameter>
    <parameter name="java.naming.provider.url">$SYSTEM:CONEXAO_BROKER</parameter>
    <parameter name="store.jms.JMSSpecVersion">1.1</parameter>
</messageStore>`
    
            return messageStore
        }
    },
    'message-processors': (documentation: any)=>{
        let name = documentation.name
        if(name){
            let nameWVersion = name.replace('.xml', '');

            let finalName = name.includes('MessageProcessor') ? name : nameWVersion + 'MessageProcessor';

            let store = name.replace('Processor', 'Store')
            let sequence = nameWVersion + 'Sequence'

            let messageProcessor = 
`<?xml version="1.0" encoding="UTF-8"?>
<messageProcessor class="org.apache.synapse.message.processor.impl.sampler.SamplingProcessor" messageStore="${store}" name="${finalName}" xmlns="http://ws.apache.org/ns/synapse">
    <parameter name="sequence">${sequence}</parameter>
    <parameter name="interval">1000</parameter>
    <parameter name="is.active">true</parameter>
    <parameter name="concurrency">1</parameter>
</messageProcessor>`

        return messageProcessor
        }
    }
}

export const createDataService = (documentation: any)=>{
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