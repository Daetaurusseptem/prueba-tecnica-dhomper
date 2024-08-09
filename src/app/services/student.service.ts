import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { Alumno } from '../interfaces/alumno.interface';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url = environment.urlApi
  constructor(private http:HttpClient){}

  getAllStudents() {
    console.log(`${this.url}/alumnos/listar`);
    return this.http.get(`${this.url}/alumnos/listar`);
  } 

  
  createStudent(student: Alumno): Observable<any> {
    const params = new HttpParams()
      .set('curp', student.curp)
      .set('matricula', student.matricula)
      .set('paterno', student.paterno)
      .set('nombre', student.nombre);

    return this.http.get<any>(`${this.url}/alumnos/agregar?curp=${student.curp}&matricula=${student.matricula}&paterno=${student.paterno}&materno=${student.materno}&nombre=${student.nombre}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteStudent(id: string): Observable<any> {
    

    return this.http.post<any>(`${this.url}/alumnos/eliminar`, { 
        body: { id } 
      })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateStudent(id: string, student: Alumno): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.url}/alumnos/guardar`, { id, ...student }, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getStudentById(id: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.url}/alumnos/obtener?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) { 
      
      console.error('Ocurrió un error:', error.error.message);
    } else {
  
      console.error(`Backend retornó el código ${error.status}, ` + `cuerpo fue: ${error.error}`);
    }
    return throwError('Algo malo pasó; por favor intente de nuevo más tarde.');
  }
}
