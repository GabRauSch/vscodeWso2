import { VariablesObject } from "../types/VariablesObject";
import * as fs from 'fs-extra';
import * as getRegistry from '../builders/registers/getRegistry'
import workspaceFolder from "./workspaceFolder";

export const variablesObject: VariablesObject = {
    artifactId:'',
    description: '',
    groupId: '',
    resources: [],
    connectorRegistry: [],
    version: '',
    root: '',
    exporter: '',
    configs: '',
    registry: ''
}


export const defineDetails = ()=>{
    let content: any = fs.readFileSync(workspaceFolder + '\\extension.json');
    content = JSON.parse(content?.toString())
    variablesObject.artifactId = content.artifactId;
    variablesObject.description = content.description;
    variablesObject.groupId = content.groupId;
    variablesObject.version = content.version;
    variablesObject.root = content.root;
    variablesObject.exporter = content.exporter;
    variablesObject.configs = content.configs;
    variablesObject.registry = content.registry;
}

export const createVariablesObject = (root?: string) =>{

    variablesObject.resources = [];
    defineDetails()
    getRegistry.getContentFromSynapseConfig()
    getRegistry.getContentFromResources()
    getRegistry.getContentFromZips()

    console.log(variablesObject.resources);

    return variablesObject;
}