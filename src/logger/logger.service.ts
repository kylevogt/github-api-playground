// tslint:disable: no-console
import { Service } from 'typedi';

@Service()
export class Logger {
    public info(message: string, context?: any) {
        console.log(message, context);
    }

    public error(message: string, context?: any) {
        console.error(message, context);
    }
}
