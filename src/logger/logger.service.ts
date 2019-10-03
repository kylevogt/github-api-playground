// tslint:disable: no-console
import { Service } from 'typedi';

@Service()
export class Logger {
    public info(message: string, context?: any) {
        if (context) {
            console.log(message, context);
        } else {
            console.log(message);
        }
    }

    public error(message: string, context?: any) {
        if (context) {
            console.error(message, context);
        } else {
            console.error(message);
        }
    }
}
