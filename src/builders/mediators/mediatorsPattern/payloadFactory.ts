import { mediaType } from "../completers"
import { xmlJson } from "../completers"
import { expression } from "../completers";
import { properties } from "../../../context/properties";

export const payloadFactory = [{
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
}]