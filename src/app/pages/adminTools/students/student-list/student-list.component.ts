import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno.interface';
import { DefaultResponse } from 'src/app/interfaces/itemResponse.interface';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {

  students: Alumno[] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (response:any) => {
        this.students = response.response;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  deleteStudent(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor, espera.',
          icon: 'info',
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });

        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            this.students = this.students.filter(student => student.id !== id);
            Swal.fire(
              'Eliminado!',
              'El estudiante ha sido eliminado.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              `Hubo un problema al eliminar el estudiante. ${error.message}`,
              'error'
            );
            console.error('Error al eliminar el estudiante:', error);
          }
        });
      }
    });
  }
  createStudent() {
    this.router.navigate(['/students/new']);
   }
   editStudent(id: string) {
    this.router.navigate(['/students/update/',id]);
  }
}
