// which files are gonna have logs

export const log = 
[
    'extensions.ts'
]
// this is for temporary changes only:
export const include =  []


export const list = (array: any[], origin: string, length: number=5)=>{
    if(log.includes(origin)){
        array.forEach((el, key)=>{
            key < length ? console.log('item', key, el) : null
        })
    }
}

export const item = (item: any, origin: string)=>{
    console.log(typeof item, item)
}