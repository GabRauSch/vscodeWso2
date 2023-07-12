import { expression, scope } from "../completers";
import { properties } from "../../../context/properties";

export let propertiesPattern = [
    {
        mediator: "property",
        structure: `<property name="\${1}" ${expression(2)}="${properties(3)}" scope="${scope(4)}"/>`
    }, 
    {
        mediator: "propertyTeste",
        structure: `<property name="teste" value="teste" scope="default"/>`
    },
    {
        mediator: 'propertyGroup',
        structure: 
`<propertyGroup>
    \${1}
</propertyGroup>`
    }
]