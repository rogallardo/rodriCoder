import path from'path'
import { fileURLToPath } from "url";
import multer from "multer";
import { connect } from 'mongoose';
import bcrypt from 'bcrypt'

//configuro el '__dirname'
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


//configuro 'multer'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//conexion mongo
export async function connectionMongo(){
try {
 await connect("mongodb+srv://rodrigogastongallardo:CRPPTDfZPNoXaNbx@cluster0.50ffnbf.mongodb.net/ecommerce?retryWrites=true&w=majority",
  )
  console.log('MongoDB connected')
} catch (error) {
  console.log(error)
  throw 'Cannot connect to MongoDB'
}
}
//bcrypt config
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword)




