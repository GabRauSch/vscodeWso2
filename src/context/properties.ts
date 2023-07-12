import * as vscode from 'vscode';
import {getWsoMediatorsValues} from '../builders/mediators/setMediators'

export const setProperties = () => {
	const currentFileText = vscode.window.activeTextEditor;
	let unsavedContent = '';
	
	if (currentFileText) {
	  const document = currentFileText.document;
	  unsavedContent = document.getText();
	}

	const propertyRegex = /<property[^>]*\s+name="([^"]*)"[^>]*\s+scope="([^"]*)"/g;
	const propertyNames: string[] = [];
	let match;
	while ((match = propertyRegex.exec(unsavedContent)) !== null) {
	  const name = match[1];
	  const scope = match[2];
	
	  let scopePrefix;
	  switch (scope) {
		case 'default':
		  scopePrefix = '$ctx:';
		  break;
		case 'transport':
		  scopePrefix = '$trp:';
		  break;
		case 'env':
		  scopePrefix = '$ctx:';
		  break;
		case 'axis2':
		  scopePrefix = '$axis2:';
		  break;
		default:
		  scopePrefix = '';
	  }
	  propertyNames.push(scopePrefix + match[1]);
	}
	console.log(propertyNames)
	
	setPropertiesArray(propertyNames)
	getWsoMediatorsValues()
}

export let propertiesArray:  String[]= ["json-eval($)", "$body", '$trp:', '$ctx:'];
export let properties: any = (pos: Number)=>"${"+pos+"|"+propertiesArray.toString()+"|}";
export const setPropertiesArray = (userSettedPropertiesArray: string[])=>{
    propertiesArray = [...userSettedPropertiesArray, "json-eval($)", "$body", '$trp:', '$ctx:', ...fnFunctions ];
    properties = (pos: Number)=>"${"+pos+"|"+propertiesArray.toString()+"|}";
};


export let fnFunctions: String[] = ['fn:concat("")', 'fn:substring("")']
export let apiArray: Object[] = [];
export let sequencesArray: String[] = ["sequence", "another"]
export let templateArray: String[] = ["template1", "template2"]
export let messageStores: String[] = ["messageStore1"]
export let xsltArray: string[] = ['conf:transform/TransformJsonObject.xslt', 'conf:transform/TransformJsonObjectUser.xslt']
