import fs from 'fs';
import path from 'path';
//import { AppError } from '@/utils/AppError';
import { STORAGE_LOCAL } from '@/configs/localStorage';

export class LocalStorage {
//     async saveFile(file: string) {
//         const tempPath = path.resolve(STORAGE_LOCAL.TMP_FOLDER, file);
//         const finalPath = path.resolve(STORAGE_LOCAL.UPLOADS_FOLDER_AVATAR, file);

    //         try {
    //             await fs.promises.rename(tempPath, finalPath);
    //             return file;
    //         } catch (error) {
    //             await this.deleteFile(tempPath);
    //             throw new AppError('Erro ao mover o arquivo de avatar.', 500);
    //         }
    //     }

    //     async deleteFile(filePath: string) {
    //         try {
    //             await fs.promises.stat(filePath);
    //         } catch {
    //             return;
    //         }
    //         try {
    //             await fs.promises.unlink(filePath);
    //         } catch (error) {
    //             throw new AppError('Erro ao remover o arquivo.', 500);
    //         }
    //     }


    async saveFile(file: string) {
        await fs.promises.rename(
            path.resolve(STORAGE_LOCAL.TMP_FOLDER, file),
            path.resolve(STORAGE_LOCAL.UPLOADS_FOLDER_AVATAR, file),
        );

        return file;
    }

    async deleteFile(file: string) {
        const filePath = path.resolve(STORAGE_LOCAL.UPLOADS_FOLDER_AVATAR, file);
        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }
        await fs.promises.unlink(filePath);
    }

}
