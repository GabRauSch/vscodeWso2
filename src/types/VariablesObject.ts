export type VariablesObject ={
    artifactId: string,
    description: string,
    groupId: string,
    resources: {finalResourceName: string, resource: string, resourceFile: string}[],
    connectorRegistry: object[],
    version: string,
    root: string,
    exporter: string,
    configs: string,
    registry: string
}
