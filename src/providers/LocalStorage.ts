import fs from 'fs';
import path from 'path';

import { STORAGE_LOCAL } from '@/configs/localStorage';

export class LocalStorage {
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