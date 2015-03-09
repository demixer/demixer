import {Inject} from 'di';
import {Driver} from './driver/driver';
import {SetResource} from './resource/set_resource';

@Inject(Driver, SetResource)
export class Server {
    constructor (driver, set_resource) {
        this.driver = driver;
        this.driver.post('/set', set_resource);
    }

    start () {
        this.driver.listen(8080);
    }
}
