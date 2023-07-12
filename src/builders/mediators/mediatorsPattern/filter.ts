import { properties } from "../../../context/properties";
import { elseMed } from "../completers";

export const filter = [
    
    {
        mediator: "filter",
        structure: 
`\${4}<filter xpath="${properties(1)} != 0" regex="\${2}"  source="${properties(3)}">
    <then>
        
    </then>
    <else>
    
    </else>
</filter>`
    },{
        mediator: 'else',
        structure: `<else${elseMed(1)}`
    }
]