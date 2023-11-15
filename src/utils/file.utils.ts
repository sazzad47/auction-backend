import * as fs from 'fs';

export class FileUtils {

    static createDirectoryIfNotExists(path) {
        if (fs.existsSync(path)) {
            return false;
        }
        fs.mkdirSync(path, {recursive: true})
        return true;
    }
}
