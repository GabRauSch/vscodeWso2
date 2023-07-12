import { properties } from "../../../context/properties";
import { method } from "../completers";
import { soap } from "../completers";
import { expression } from "../completers";
import { template } from "../completers";

export const call = [
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
    }]