import { DataState } from "../enum/DataState";

export interface AppSatate <T>{
    dataState: DataState;
    appData?: T;
    error?: string;
}