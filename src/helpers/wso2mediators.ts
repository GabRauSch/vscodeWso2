import * as vscode from 'vscode'
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

const methods = ['get', 'post', 'put', 'delete', 'patch']
const soaps = Array.from({length: 12}, (_, index) => "soap" + (12 - index));
const headersArray = ["Authorization", "To", "ApplicationName", "Content-type", "Content-length", " "]

const expression = (pos: Number)=>"${"+pos+"|expression, value|}"
const level = (pos: Number)=>"${"+pos+"|custom, full, simple|}"
const mediaType = (pos: Number)=>"${"+pos+"|json, xml|}"
const xmlJson = (pos: Number)=>"${"+pos+"|<soapenv:Body></soapenv:Body>, {\n\"name\":$1\n}|}";
const key = (pos: Number)=>"${"+pos+"|"+sequencesArray.toString()+"|}"
const scope = (pos: Number)=>"${"+pos+"|default,env,transport,axis2|}";
const method = (pos: Number)=>"${"+pos+"|"+methods.toString()+"|}"
const soap = (pos: Number)=>"${"+pos+"|"+soaps+"|}"
const template = (pos: Number)=> "${"+pos+"|"+templateArray.toString()+"|}"
const messageStore = (pos: Number) => "${"+pos+"|"+messageStores.toString()+"|}"
const xslt = (pos: Number)=> "${"+pos + "|" + xsltArray.map((xslt) => xslt.split('/')[1].split('.')[0]).join(', ') + "|}";
const header = (pos: Number)=> "${"+pos+"|"+headersArray.toString()+"|}"


export let wso2Mediators: any = [];
export let getWsoMediatorsValues = ()=>{
    wso2Mediators = 
    [
    {
        mediator: "property",
        structure: `<property name="\${1}" ${expression(2)}="${properties(3)}" scope="${scope(4)}"/>`
    },
    {
        mediator: "log",
        structure: `<log level="${level(1)}">\n\t<property name="\${2}" ${expression(3)}="${properties(4)}\${5}"/>\n</log>`
    },
    {
        mediator: "logFull",
        structure: `<log level="full" />`
    },
    {
        mediator: "payloadFactory",
        structure: 
`<payloadFactory media-type="${mediaType(1)}">
    <format>
        ${xmlJson(2)}
    </format>
    <args>
        <arg evaluator="${mediaType(3)}" ${expression(4)}="${properties(5)}"/>
    </args>
</payloadFactory>`
    },
    {
        mediator: "arg",
        structure: `<arg evaluator="${mediaType(1)}" expression="${properties(2)}/>`
    },
    {
        mediator: "sequence",
        structure: `<sequence key="${key(1)}" />`
    },
    {
        mediator: "switch",
        structure: 
`<switch source="${properties(1)}">
    <case regex="\${2}">
        
    </case>
    \${3|<default></default>,\t|}
</switch>`
    },
    {
        mediator: "filter",
        structure: 
`\${4}<filter xpath="${properties(1)} != 0" regex="\${2}"  source="${properties(3)}">
    <then>
        
    </then>
    <else>
    
    </else>
</filter>`
    },
    {
        mediator: "enrich",
        structure: 
`<enrich>
    <source type="\${1|property, body|}" property="${properties(2)}" clone="\${3|true, false|}" />
    <target type="\${4|property , body|}" property="${properties(5)}" action="\${6|child,default|}"/>
</enrich>`
    },
    {
        mediator: "respond",
        structure: `<respond />`
    },
    {
        mediator: "callhttp",
        structure: 
`<call>
    <endpoint>
        <http method="${method(1)}" uri-template="\${2}">
            <suspendOnFailure>
                <initialDuration>-1</initialDuration>
                <progressionFactor>-1</progressionFactor>
                <maximumDuration>0</maximumDuration>
            </suspendOnFailure>
            <markForSuspension>
                <retriesBeforeSuspension>0</retriesBeforeSuspension>
            </markForSuspension>
        </http>
    </endpoint>
</call>`
    },
    {
        mediator: "calldefault",
        structure: 
`<call>
    <endpoint>
        <default format="${soap(1)}">
            <suspendOnFailure>
                <initialDuration>-1</initialDuration>
                <progressionFactor>1</progressionFactor>
            </suspendOnFailure>
            <markForSuspension>
                <retriesBeforeSuspension>0</retriesBeforeSuspension>
            </markForSuspension>
        </default>
    </endpoint>
</call>`
    },
    {
        mediator: "callTemplate",
        structure: 
`<call-template target="${template(1)}">
    <with-param name="$\{2}" ${expression(3)}="${properties(4)}"/>
</call-template>`
    },
    {
        mediator: "messageStore",
        structure: `<store messageStore="${messageStore(1)}"/>`
    },
    {
        mediator: "xml",
        structure: `<?xml version="1.0" encoding="UTF-8"?>`
    },
    {
        mediator: 'api',
        structure: 
`<api context="\${1}" name="\${2}" \${3| , version="v1"|} \${4| , version-type="url", version-type="context"|}  xmlns="http://ws.apache.org/ns/synapse">
    <resource methods="${method(5).toUpperCase()}" uri-template="/\${6}">
        <inSequence>
            
        </inSequence>
        <outSequence/>
        <faultSequence/>
    </resource>
</api>`
    },
    {
        mediator: 'api',
        structure: 
`<api context="/" name=""  xmlns="http://ws.apache.org/ns/synapse">
    <resource methods="${method(5).toUpperCase()}" uri-template="/\${6}">
        <inSequence>
            
        </inSequence>
        <outSequence/>
        <faultSequence/>
    </resource>
</api>`
    },
    {
        mediator: 'xslt',
        structure: `<xslt key="${xslt(1)}"/>`
    },
    {
        mediator: 'header',
        structure: `<header ${expression(1)}="${properties(2)}" name="${header(3)}" scope="default"/>`
    },
    {
        mediator: 'propertyGroup',
        structure: 
`<propertyGroup>
    \${1}
</propertyGroup>`
    },{
        mediator: '$ctx:',
        structure: `"${properties(1)}"`
    }
    ]
}