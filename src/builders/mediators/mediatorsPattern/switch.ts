import { properties } from "../../../context/properties"
const switchMed = [
    {
        mediator: "switch",
        structure: 
`<switch source="${properties(1)}">
    <case regex="\${2}">
        
    </case>
    \${3|<default></default>,\t|}
</switch>`
    }
]