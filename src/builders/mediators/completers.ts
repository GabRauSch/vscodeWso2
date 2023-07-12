import { sequencesArray } from "../../context/properties";
import { templateArray } from "../../context/properties";
import { messageStores } from "../../context/properties";
import { xsltArray } from "../../context/properties";

const methods = ['get', 'post', 'put', 'delete', 'patch']
const soaps = Array.from({length: 12}, (_, index) => "soap" + (12 - index));
const headersArray = ["Authorization", "To", "ApplicationName", "Content-type", "Content-length", " "]


export const expression = (pos: Number)=>"${"+pos+"|expression,value|}"
export const level = (pos: Number)=>"${"+pos+"|custom,full,simple|}"
export const mediaType = (pos: Number)=>"${"+pos+"|json,xml|}"
export const xmlJson = (pos: Number)=>"${"+pos+"|<soapenv:Body></soapenv:Body>,{\n\"name\":$1\n}|}";
export const key = (pos: Number)=>"${"+pos+"|"+sequencesArray.toString()+"|}"
export const scope = (pos: Number)=>"${"+pos+"|default,env,transport,axis2|}";
export const method = (pos: Number)=>"${"+pos+"|"+methods.toString()+"|}"
export const soap = (pos: Number)=>"${"+pos+"|"+soaps+"|}"
export const template = (pos: Number)=> "${"+pos+"|"+templateArray.toString()+"|}"
export const messageStore = (pos: Number) => "${"+pos+"|"+messageStores.toString()+"|}"
export const xslt = (pos: Number)=> "${"+pos + "|" + xsltArray.map((xslt) => xslt.split('/')[1].split('.')[0]).join(', ') + "|}";
export const header = (pos: Number)=> "${"+pos+"|"+headersArray.toString()+"|}"
export const elseMed = (pos: number) => "${"+pos+"|/>,></else>|}"
