import {SoundcloudDownloader} from '.'

export class DownloaderFactory {
    getDownloader (url) {
        if (-1 !== url.indexOf('soundcloud.com')) {
            return new SoundcloudDownloader(url);
        }

        throw 'No downloader for url ' + url;
    }
}
