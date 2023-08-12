import fs from 'fs'
import path from'path'
import { __dirname } from '../../../utils/utils.js'


// funciones de escritura y lectura JSON, descomentar para usar en product y cart Managers
export async function JSONreader(directory){
    const filePath = path.join(__dirname, directory)
    try {
        const file =  await fs.promises.readFile(filePath,'utf-8')
        const fileParsed = JSON.parse(file)
        return fileParsed       
    } catch (error) {
        throw Error('Error al leer archivo JSON')
    }    
}

export async function JSONwriter(directory, fileToWrite){
    const filePath = path.join(__dirname, directory)
    try {
        const fileParsed = JSON.stringify(fileToWrite)
        await fs.promises.writeFile(filePath, fileParsed)
        return    
    } catch (error) {
        throw Error('Error al escribir archivo JSON')
    }    
}



