
export interface Alumno {
    id?: string;
    creado?: string;
    modificado?: string;
    curp: string;
    matricula: string;
    paterno: string;
    materno?: string;
    nombre: string;
    nombre_completo?: string;
    grado?: string | null;
    grupo?: string | null;
    carrera?: string | null;
    turno?: string | null;
    imagen_thumb?: string;
}



