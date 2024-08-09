import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { Alumno } from 'src/app/interfaces/alumno.interface';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent {
 
  studentId!: string;
  student!: Alumno;
  studentForm: FormGroup;
  loading: boolean = true;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.studentForm = this.fb.group({
      curp: ['', [Validators.required, Validators.maxLength(18), this.curpValidator]],
      matricula: ['', [Validators.required, Validators.maxLength(20), this.fixedLengthValidator(20)]],
      paterno: ['', [Validators.required, Validators.maxLength(50)]],
      materno: ['', [Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.studentId = params['id'];
      this.loadStudent();
    });
  }

  loadStudent() {
    this.studentService.getStudentById(this.studentId)
      .pipe(map((response:any) => response.response))
      .subscribe(student => {
        console.log(student);
        this.student = student;
        this.studentForm.patchValue({
          curp: student.curp,
          matricula: student.matricula,
          paterno: student.paterno,
          materno: student.materno,
          nombre: student.nombre
        });
        this.loading = false;
      }, error => {
        this.loading = false;
        Swal.fire(
          'Error!',
          `Hubo un problema al cargar los datos del estudiante. ${error.message}`,
          'error'
        );
      });
  }

  curpValidator(control: AbstractControl): ValidationErrors | null {
    const curpRegex = /^[A-Z]{4}\d{6}[A-Z]{6}\d{2}$/;
    return curpRegex.test(control.value) ? null : { invalidCurp: true };
  }

  fixedLengthValidator(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length === length ? null : { invalidLength: true };
    };
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres actualizar este estudiante?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedStudent: Alumno = this.studentForm.value;
          this.studentService.updateStudent(this.studentId, updatedStudent).subscribe({
            next: () => {
              Swal.fire(
                'Actualizado!',
                'El estudiante ha sido actualizado.',
                'success'
              );
              this.router.navigate(['/students']); 
            },
            error: (error) => {
              Swal.fire(
                'Error!',
                `Hubo un problema al actualizar el estudiante. ${error.message}`,
                'error'
              );
              console.error('Error al actualizar el estudiante:', error);
            }
          });
        }
      });
    }
  }

  campoNoValido(campo: string): boolean {
    return this.studentForm.get(campo)?.invalid ?? false;
  }

}
