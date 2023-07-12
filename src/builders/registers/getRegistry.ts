import { variablesObject } from "../../context/variablesObject";
import * as fs from 'fs';
import { findFileOrFolderWith } from "../../devHelpers/files";
import workspaceFolder from "../../context/workspaceFolder";
import { normalizeName } from "../../devHelpers/normalizer";
import * as xmlReader from 'xml2js'

export const getPomContent = (properties: any, dependencies: any)=>{
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <modelVersion>4.0.0</modelVersion>
    <groupId>${variablesObject.groupId}</groupId>
    <artifactId>${variablesObject.artifactId}</artifactId>
    <version>1.0.0</version>
    <packaging>carbon/application</packaging>
    <name>${variablesObject.artifactId}</name>
    <description>${variablesObject.description}</description>
    <properties>
${properties}\t</properties>
    <dependencies>
${dependencies}</dependencies>
    <repositories>
        <repository>
          <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
          </releases>
          <id>wso2-nexus</id>
          <url>http://nexus.apps.intelbras.com.br/repository/wso2-public/</url>
        </repository>
        <repository>
          <id>wso2-maven2-repository-1</id>
          <url>http://dist.wso2.org/maven2</url>
        </repository>
        <repository>
          <id>wso2-nexus-repository-1</id>
          <url>http://nexus.apps.intelbras.com.br/repository/wso2-public/</url>
        </repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository>
          <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
          </releases>
          <id>wso2-nexus</id>
          <url>http://nexus.apps.intelbras.com.br/repository/wso2-public/</url>
        </pluginRepository>
        <pluginRepository>
          <id>wso2-maven2-repository-1</id>
          <url>http://dist.wso2.org/maven2</url>
        </pluginRepository>
        <pluginRepository>
          <id>wso2-nexus-repository-1</id>
          <url>http://nexus.apps.intelbras.com.br/repository/wso2-public/</url>
        </pluginRepository>
      </pluginRepositories>
      <build>
        <plugins>
          <plugin>
            <artifactId>maven-eclipse-plugin</artifactId>
            <version>2.9</version>
            <configuration>
              <buildcommands/>
              <projectnatures>
                <projectnature>org.wso2.developerstudio.eclipse.distribution.project.nature</projectnature>
              </projectnatures>
            </configuration>
          </plugin>
          <plugin>
            <groupId>org.wso2.maven</groupId>
            <artifactId>maven-car-plugin</artifactId>
            <version>2.1.1</version>
            <extensions>true</extensions>
            <executions>
              <execution>
                <id>car</id>
                <phase>package</phase>
                <goals>
                  <goal>car</goal>
                </goals>
              </execution>
            </executions>
            <configuration/>
          </plugin>
          <plugin>
            <groupId>org.wso2.maven</groupId>
            <artifactId>maven-car-deploy-plugin</artifactId>
            <version>1.1.1</version>
            <extensions>true</extensions>
            <configuration>
              <carbonServers>
                <CarbonServer>
                  <trustStorePath>\${basedir}/src/main/resources/security/wso2carbon.jks</trustStorePath>
                  <trustStorePassword>wso2carbon</trustStorePassword>
                  <trustStoreType>JKS</trustStoreType>
                  <serverUrl>https://localhost:9443</serverUrl>
                  <userName>admin</userName>
                  <password>admin</password>
                  <operation>deploy</operation>
                </CarbonServer>
              </carbonServers>
            </configuration>
          </plugin>
        </plugins>
      </build>
</project>    `;

      return xml;
}


export const getArtifactContent = (artifacts: string)=>{
    let xml = 
  `<?xml version="1.0" encoding="UTF-8"?>
    <artifacts>
      ${artifacts}</artifacts>`
    return xml
  }

export const getConnectorRegistry = (resource: any[])=>{
  let resourcesPath = findFileOrFolderWith(workspaceFolder, 'ConnectorExporter')
  let resources: any = fs.readdirSync(resourcesPath,);
  
  const trash: string[] = [".classpath", ".meta", ".project", ".settings", "artifact.xml", "pom.xml"];
  const filteredResources: string[] = resources.filter((item: string) => !trash.includes(item));
  
  filteredResources.forEach((resource: string)=> {
      let finalResourceName = resource.split('.')[0] 
      variablesObject.resources.push({finalResourceName, resource: 'resource', resourceFile: resource})               
  });
}


export const getContentFromResources = ()=>{   
  console.log('Pegando conteudos do resources (transforms, datamappers, etc...)')
  let root = findFileOrFolderWith(workspaceFolder, variablesObject.root);
  let resourcesPath = findFileOrFolderWith(root, variablesObject.registry)
  let resources: any = fs.readdirSync(resourcesPath);
  
  const trash: string[] = [".classpath", ".meta", ".project", ".settings", "artifact.xml", "pom.xml"];
  const filteredResources: string[] = resources.filter((item: string) => !trash.includes(item));
  
  filteredResources.forEach((resource: string)=> {
      let finalResourceName = resource.split('.')[0] 
      console.log('como pode peixe vivo viver fora da agua fria', variablesObject.resources.some((item)  => {console.log(item.finalResourceName, finalResourceName); return item.finalResourceName === finalResourceName}))
      if (variablesObject.resources.some(item => item.finalResourceName === finalResourceName)) {
          console.log('Já inclui essa porra aí');
        } else {
          variablesObject.resources.push({ finalResourceName, resource: `${variablesObject.groupId}.${variablesObject.registry}.reource`, resourceFile: resource });
        }         
  });

  console.log('--------- sucesso ---------)') 
}

export  const getContentFromZips = ()=>{
  console.log('pegando conteudos ZIP')
  const zips = fs.readdirSync(workspaceFolder + '\\'+ variablesObject.root).filter(el => el.endsWith('.zip'));
  console.log(zips);
  
  zips.forEach((el)=>{
      let finalResourceName = el.split('-')[0]
      let resource =  `${variablesObject.configs}.${variablesObject.groupId}.lib`
      let resourceFile = el
      
      variablesObject.resources.push({finalResourceName, resource, resourceFile})
  });
}

export const getContentFromSynapseConfig = ()=>{
  console.log('Pegando conteudos do Synapse config (APIS, Sequences, etc...)')
  let synapse = '\\src\\main\\synapse-config';

  let rootPath: any = findFileOrFolderWith(workspaceFolder, variablesObject.root);
  let resourcesPath: any  = findFileOrFolderWith(rootPath, variablesObject.configs) + synapse;

  let resources: any = fs.readdirSync(resourcesPath);

  resources.forEach((resource: string)=> {
      console.log('Recurso', resource)
      let resourceName = normalizeName(resource)
      resource == 'proxy-services' ? resourceName = 'proxy' : null


      let folderPath = resourcesPath + '\\' + resource;

      let resourceItem = fs.readdirSync(folderPath)

      resourceItem.forEach((resourceFile)=>{
          let finalPath = folderPath + '\\' + resourceFile;
          console.log('\tarquivo do recurso', finalPath)
          let xmlFile = fs.readFileSync(finalPath)
          if(xmlFile.byteLength != 0){
              xmlReader.parseString(xmlFile, (err, result)=>{
                  let finalResourceName: string;
                  if(result[resourceName].$){
                      finalResourceName = (result[resourceName].$.key) ? result[resourceName].$.key :  result[resourceName].$.name;
                      variablesObject.resources.push({finalResourceName, resource: `${variablesObject.groupId}.${variablesObject.configs}.${resource}`, resourceFile})
                  }
              })
          }
      })
  });

  console.assert('--------- sucesso ---------)')
}