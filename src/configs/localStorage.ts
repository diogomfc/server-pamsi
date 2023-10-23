import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

//Salvar em disco local 
const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
const UPLOADS_FOLDER_AVATAR = path.resolve(TMP_FOLDER, 'avatar_user');
const UPLOADS_FOLDER_FILES = path.resolve(TMP_FOLDER, 'files');

const localDiskStorage = multer.diskStorage({
    destination: TMP_FOLDER,
    filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
    },
});


export const STORAGE_LOCAL = {
    uploadFile: localDiskStorage,
    TMP_FOLDER,
    UPLOADS_FOLDER_AVATAR,
    UPLOADS_FOLDER_FILES
};
