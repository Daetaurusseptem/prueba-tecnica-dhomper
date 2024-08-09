import { Component } from '@angular/core';
import { Alumno } from '../interfaces/alumno.interface';
import { StudentService } from '../services/student.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent {
  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      curp: ['', [Validators.required, Validators.maxLength(18), this.curpValidator]],
      matricula: ['', [Validators.required, Validators.maxLength(20), this.fixedLengthValidator(20)]],
      paterno: ['', [Validators.required, Validators.maxLength(50)]],
      materno: ['', [Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {}

  get curp() { return this.studentForm.get('curp'); }
  get matricula() { return this.studentForm.get('matricula'); }
  get paterno() { return this.studentForm.get('paterno'); }
  get materno() { return this.studentForm.get('materno'); }
  get nombre() { return this.studentForm.get('nombre'); }

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
        text: "¿Quieres crear este estudiante?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const newStudent: Alumno = this.studentForm.value;
          this.studentService.createStudent(newStudent).subscribe({
            next: (student) => {
              Swal.fire(
                'Creado!',
                'El estudiante ha sido creado.',
                'success'
              );
              this.router.navigate(['/students']);
            },
            error: (error) => {
              Swal.fire(
                'Error!',
                `Hubo un problema al crear el estudiante. ${error.message}`,
                'error'
              );
              console.error('Error al crear el estudiante:', error);
            }
          });
        }
      });
    }
  }
}
