import { mediaType } from "./completers"
import { properties } from "../../context/properties"
import { messageStore } from "./completers"
import { xslt } from "./completers"
import { expression } from "./completers"
import { header } from "./completers"

export const mediators = [    
    {
        mediator: "arg",
        structure: `<arg evaluator="${mediaType(1)}" expression="${properties(2)}"/>`
    },,
    {
        mediator: "respond",
        structure: `<respond />`
    },
    {
        mediator: "messageStore",
        structure: `<store messageStore="${messageStore(1)}"/>`
    },,,
    {
        mediator: 'xslt',
        structure: `<xslt key="${xslt(1)}"/>`
    },
    {
        mediator: 'header',
        structure: `<header ${expression(1)}="${properties(2)}" name="${header(3)}" scope="default"/>`
    },,{
        mediator: '$ctx:',
        structure: `"${properties(1)}"`
    },
    ]