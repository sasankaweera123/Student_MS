import { Gender } from "../enum/gender.enum"; 

export interface Student{
    id:number;
    name: string;
    dob: Date;
    gender: Gender;
    age: number;
}