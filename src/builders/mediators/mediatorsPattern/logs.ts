import { properties, propertiesArray } from "../../../context/properties";
import { level } from "../completers";
import { expression} from "../completers";


export const logs = [
    {
        mediator: "log",
        structure: `<log level="${level(1)}">\n\t<property name="\${2}" ${expression(3)}="${properties(4)}\${5}"/>\n</log>`
    },
    {
        mediator: "log full",
        structure: `<log level="full"/>`
    },
    {
        mediator: "Log last prop",
        structure: `<log level="custom">\n\t<property name="${propertiesArray[0].split(':')[1]}" expression="${propertiesArray[0]}"/></log`
    },
    {
        mediator: 'log200',
        structure: `<log level="custom">\n\t<property name="--------------------- = 200" value="---------------------"/>\n</log>`
    },
    {
        mediator: 'log404',
        structure: `<log level="custom">\n\t<property name="--------------------- = 404" value="---------------------"/>\n</log>`
    },
    {
        mediator: 'log500',
        structure: `<log level="custom">\n\t<property name="--------------------- = 500" value="---------------------"/>\n</log>`
    }
]