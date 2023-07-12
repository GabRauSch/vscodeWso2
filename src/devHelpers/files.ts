import * as fs from 'fs-extra'

export const findFileOrFolderWith = (basedir: string, goal: string)=>{
    const folder = fs.readdirSync(basedir);
    let responseFolder = basedir;
    folder.find((el)=>{
        if(el == goal)
            responseFolder += `\\${el}`
    })

    console.log('bucando pasta', responseFolder)
    return responseFolder
}



export const getFileType = (dir: string)=>{
    if(dir.indexOf("\\src\\main\\synapse-config\\api") > -1)
        return 'api' 
    if(dir.indexOf("\\src\\main\\synapse-config\\sequence") > -1)
        return 'sequence'
    if(dir.indexOf("\\src\\main\\synapse-config\\local-entries") > -1)
        return 'local-entries'
    if(dir.indexOf("\\src\\main\\synapse-config\\message-processors") > -1)
        return 'message-processors'
    if(dir.indexOf("\\src\\main\\synapse-config\\message-stores") > -1)
        return 'message-stores'
    if(dir.indexOf("\\src\\main\\synapse-config\\tasks") > -1)
        return 'tasks'
    if(dir.indexOf("\\src\\main\\synapse-config\\templates") > -1)
        return 'templates'

    return 'Desconhecido'
}
