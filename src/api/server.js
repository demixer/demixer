import {Inject} from 'di';
import {Driver} from './driver/driver';
import {Set} from './resource/set';

@Inject(Driver, Set)
export class Server {
    constructor (driver, set) {
        this.driver = driver;
        this.driver.post('/set', set);
    }

    start () {
        this.driver.listen(8080);
    }
}
