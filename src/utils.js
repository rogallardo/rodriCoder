import path from'path'
import { fileURLToPath } from "url";
import multer from "multer";
//configuro el '__dirname'
export const __filename = fileURLToPath(import.meta.url);
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

