import { Student } from "./student";

export interface CustomResponse {
    timestamp: Date;
    statusCode: number;
    reason: string;
    message: string;
    developerMessage: string;
    data: {students?: Student[], student?: Student};
}