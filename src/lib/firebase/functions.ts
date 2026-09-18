import { getFunctions, Functions } from 'firebase/functions';
import { app } from './config';

export const functions: Functions = getFunctions(app, 'us-central1');
export default functions;
