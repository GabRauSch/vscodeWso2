import { method } from "../completers"
const structure = [
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
    <resource methods="${method(1).toUpperCase()}" uri-template="/\${6}">
        <inSequence>
            
        </inSequence>
        <outSequence/>
        <faultSequence/>
    </resource>
</api>`
    },
    {
        mediator: "xml",
        structure: `<?xml version="1.0" encoding="UTF-8"?>`
    },{
        mediator: 'resource',
        structure: `<resourece methods=${method(1)}>\n\t\n</reosource`
    }
]