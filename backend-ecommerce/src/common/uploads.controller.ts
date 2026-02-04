import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('uploads')
export class UploadsController {
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        // Return the path that can be used to access the file
        // Since we serve static from /uploads, we return that path
        return { url: `/uploads/${file.filename}` };
    }
}
