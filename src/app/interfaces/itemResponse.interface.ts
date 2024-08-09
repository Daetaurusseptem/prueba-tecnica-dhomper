import { Alumno } from "./alumno.interface";


export interface DefaultResponse {
    meta: Meta;
    response: Alumno[];
}

export interface Meta {
    code: number;
    message: string;
    error: boolean;
    errors: any[];
    success: any[];
    keys: any[];
    total_items: number;
    total_pages: number;
    data: any[];
}