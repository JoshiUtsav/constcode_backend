import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

// Define the type for file (optional based on the properties you need)
interface MulterFile {
  fieldname: string;
  originalname: string;
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadPath = path.join(__dirname, "../../public/temp");
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${timestamp}-${randomSuffix}${extension}`;
    cb(null, fileName);
  },
});

export default storage;
