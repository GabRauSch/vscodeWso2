import { variablesObject } from "../../context/variablesObject";

export const createResource: any = {
    api: (documentation?: any)=>{
        let nameWVersion = documentation.name?.replace('.xml', '');
        let name = nameWVersion.replace('_v1', '');
        let context = name.replace('API', '');
    
        let api = 
`<?xml version="1.0" encoding="UTF-8"?>
<api context="/${context ? context.toLowerCase() : ''}" name="${name}" xmlns="http://ws.apache.org/ns/synapse">
    <resource methods="GET" uri-template="/">
        <inSequence>
            <log level="custom">
                <property name="entrando na API" value="/"/>
            </log>
            <respond/>
        </inSequence>
        <outSequence/>
        <faultSequence/>
    </resource>
</api>`
    
    
        return api
    },
    sequence: (documentation: any)=>{
        let nameWVersion = documentation.name?.replace('.xml', '');
        let sequence = 
`<?xml version="1.0" encoding="UTF-8"?>
<sequence name="${nameWVersion}" trace="disable" xmlns="http://ws.apache.org/ns/synapse">

</sequence>`
    return sequence
    },
    templates: (documentation: any)=>{
        let nameWVersion = documentation.name?.replace('.xml', '');
        let sequence = 
`<?xml version="1.0" encoding="UTF-8"?>
<template name="${nameWVersion}" xmlns="http://ws.apache.org/ns/synapse">
    <parameter defaultValue="" isMandatory="false" name="origin"/>

</sequence>`
    return sequence
    },
    'message-stores': (documentation: any)=>{
        let name = documentation.name
        if(name){
            let nameWVersion = name.replace('.xml', '');

            let queue = name.replace('Store', 'Queue')
           
            let messageStore = 
`<?xml version="1.0" encoding="UTF-8"?>
<messageStore class="org.apache.synapse.message.store.impl.jms.JmsStore" name="${nameWVersion}" xmlns="http://ws.apache.org/ns/synapse">
    <parameter name="store.jms.destination">${variablesObject.artifactId}-${queue}</parameter>
    <parameter name="store.jms.username">$SYSTEM:USERNAME_AMQ</parameter>
    <parameter name="store.jms.connection.factory">QueueConnectionFactory</parameter>
    <parameter name="store.producer.guaranteed.delivery.enable">false</parameter>
    <parameter name="store.jms.password">$SYSTEM:PASSWORD_AMQ</parameter>
    <parameter name="store.jms.cache.connection">false</parameter>
    <parameter name="java.naming.factory.initial">org.apache.activemq.jndi.ActiveMQInitialContextFactory</parameter>
    <parameter name="java.naming.provider.url">$SYSTEM:CONEXAO_BROKER</parameter>
    <parameter name="store.jms.JMSSpecVersion">1.1</parameter>
</messageStore>`
    
            return messageStore
        }
    },
    'message-processors': (documentation: any)=>{
        let name = documentation.name
        if(name){
            let nameWVersion = name.replace('.xml', '');

            let finalName = name.includes('MessageProcessor') ? name : nameWVersion + 'MessageProcessor';

            let store = name.replace('Processor', 'Store')
            let sequence = nameWVersion + 'Sequence'

            let messageProcessor = 
`<?xml version="1.0" encoding="UTF-8"?>
<messageProcessor class="org.apache.synapse.message.processor.impl.sampler.SamplingProcessor" messageStore="${store}" name="${finalName}" xmlns="http://ws.apache.org/ns/synapse">
    <parameter name="sequence">${sequence}</parameter>
    <parameter name="interval">1000</parameter>
    <parameter name="is.active">true</parameter>
    <parameter name="concurrency">1</parameter>
</messageProcessor>`

        return messageProcessor
        }
    }
}