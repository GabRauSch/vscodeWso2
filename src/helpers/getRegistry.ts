import {variablesObject, VariablesObject} from "./configVariablesObject";
import * as builder from './builder';
import * as fs from 'fs-extra'
import * as vscode from 'vscode'
import { findFileOrFolderWith } from "./findFiles";

let workspaceFolders = vscode.workspace.workspaceFolders;
let workspaceFolder = '';
if (workspaceFolders && workspaceFolders.length > 0) {
    workspaceFolder = workspaceFolders[0].uri.fsPath;
} 


export const pomContent = (properties: any, dependencies: any)=>{
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <modelVersion>4.0.0</modelVersion>
    <groupId>br.com.intelbras.crm</groupId>
    <artifactId>${variablesObject.artifactId}</artifactId>
    <version>1.0.0</version>
    <packaging>carbon/application</packaging>
    <name>${variablesObject.name}</name>
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

export const artifactContent = (artifacts: string)=>{
  let xml = 
`<?xml version="1.0" encoding="UTF-8"?>
  <artifacts>
    ${artifacts}
  </artifacts>`
  return xml
}

export const createPom = ()=>{
  let dependencies = builder.createDependenciesPattern()
  let properties = builder.createPropertiesPattern();

  let content = pomContent(dependencies, properties);

  let folder = findFileOrFolderWith(workspaceFolder, 'CompositeExporter');

  fs.writeFileSync(folder + '\\pom.xml', content)
}