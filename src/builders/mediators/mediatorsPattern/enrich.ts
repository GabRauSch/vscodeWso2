import { properties } from "../../../context/properties"

export const enrich = [
    {
        mediator: "enrichBody",
        structure: 
    `<enrich>
    <source type="body" clone="\${1|true, false|}" />
    <target type="property" property="\${2}" action="\${6|child,default|}"/>
    </enrich>`
    },
    {
        mediator: "enrichProperty",
        structure: 
    `<enrich>
    <source type="property" property="${properties(2)}"/>
    <target type="\${4|property,body|}" property="${properties(5)}"/>
    </enrich>`
    }
]