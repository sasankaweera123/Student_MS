import { DataState } from '../enum/dataState';

export interface AppSatate <T>{
    dataState: DataState;
    appData?: T;
    error?: string;
}