import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { RequestHandler, Request } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import multerS3 from 'multer-s3';

import { s3Client } from '@/configs/s3Storage';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { env } from '@/env';

// Função para configurar o armazenamento S3
const s3Storage = (folderName: string) => multerS3({
    s3: s3Client,
    bucket: env.S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata:  (req, file, cb) => {
        cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
        crypto.randomBytes(10, (err, hash) => {
            if (err) {
                logger.error(`Erro ao gerar nome do arquivo: ${err}`);
                cb(err);
            }
            const fileName = `${folderName}/${hash.toString('hex')}-${file.originalname}`;
            console.log('Nome do arquivo:', fileName);
            cb(null, fileName);
        });
    }
});

// Função para fazer upload de um único arquivo para o S3
const uploadSingleFileToS3 = (fieldName: string, folderName: ((req: Request) => string) | string): RequestHandler => {
    return (req, res, next) => {
        try {
            const dynamicFolderName = typeof folderName === 'function' ? folderName(req) : folderName;
            const storage = s3Storage(dynamicFolderName);
            return multer({ storage }).single(fieldName)(req, res, next);
        } catch (error) {
            logger.error(`Erro ao fazer upload do arquivo: ${error}`);
            next(new AppError('Erro ao fazer upload do arquivo.', 500));
        }
    };
};

// Função para fazer upload de vários campos para o S3
const uploadFieldsToS3 = (fields: { name: string, maxCount: number }[], folderName: ((req: Request) => string) | string): RequestHandler => {
    return (req, res, next) => {
        try {
            const dynamicFolderName = typeof folderName === 'function' ? folderName(req) : folderName;
            const storage = s3Storage(dynamicFolderName);
            return multer({ storage }).fields(fields)(req, res, next);
        } catch (error) {
            logger.error(`Erro ao fazer upload dos campos: ${error}`);
            next(new AppError('Erro ao fazer upload dos campos.', 500));
        }
    };
};

// Função para fazer upload de vários arquivos para o S3
const uploadMultipleFilesToS3 = (fieldName: string, maxCount: number, folderName: ((req: Request) => string) | string): RequestHandler => {
    return (req, res, next) => {
        try {
            const dynamicFolderName = typeof folderName === 'function' ? folderName(req) : folderName;
            const storage = s3Storage(dynamicFolderName);
            return multer({ storage }).array(fieldName, maxCount)(req, res, next);
        } catch (error) {
            logger.error(`Erro ao fazer upload de múltiplos arquivos: ${error}`);
            next(new AppError('Erro ao fazer upload de múltiplos arquivos.', 500));
        }
    };
};

// Função para deletar um arquivo do S3
const deleteFileFromS3 = async (fileKey: string): Promise<void> => {
    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: fileKey
        });
        await s3Client.send(deleteCommand);
    } catch (error) {
        logger.error(`Erro ao deletar o arquivo: ${error}`);
        throw new AppError('Erro ao deletar o arquivo.', 500);
    }
};

export const S3StorageService = {
    single: uploadSingleFileToS3,
    fields: uploadFieldsToS3,
    multiple: uploadMultipleFilesToS3,
    delete: deleteFileFromS3,
};
