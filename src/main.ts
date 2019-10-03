import * as axios from 'axios';
import Container from "typedi";
import { AXIOS } from './injection-tokens';

execute()
    .then(() => console.log('Process has completed'))
    .catch((error) => console.error('Process has encountered an uncaught error', error));

async function execute(): Promise<void> {
    console.log('Executing');
}
