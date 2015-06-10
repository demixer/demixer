import {DownloaderFactory} from '.';
import {Inject} from 'di';
import {SetDal} from '../dal/set_dal';

@Inject(DownloaderFactory, SetDal)
export class DownloadOneSet {
    constructor (downloaderFactory, setDal) {
        this.downloaderFactory;
        this.setDal = setDal;
    }

    run () {
        var downloader;

        // 1. Find a single undownloaded set
        promise = setDal.findOneUndownloaded();

        // 2. User downloader to download set
        promise.then(function (set) {
            downloader = this.downloaderFactory.getDownloader(set.url);
            return downloader.download();
        }, function (err) {
            console.log('err', err);
        });

        // 3. Update the database
        promise.then(function (set) {
            //return setDal.markDownloaded(set.id);
        }, function (err) {
            console.log(err);
        });
    }
}
