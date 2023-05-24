import fs from 'fs'
import path from'path'

//funciones de lectura del JSON
export async function JSONreader(directory){
    try {
        const file =  await fs.promises.readFile(path.resolve()  + directory,'utf-8')
        const fileParsed = JSON.parse(file)
        return fileParsed       
    } catch (error) {
        error('Error reading JSON')
    }    
}
//funcion de escritura del JSON
export async function JSONwriter(directory, fileToWrite){
    try {
        const productsJSON = JSON.stringify(fileToWrite)
        await fs.promises.writeFile(path.resolve()  + directory, productsJSON)
        return    
    } catch (error) {
        error('Error writing JSON')
    }    
}



