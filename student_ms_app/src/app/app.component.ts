import { Component, OnInit } from '@angular/core';
import { StudentService } from './service/student.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { AppSatate } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { DataState } from './enum/dataState';
import { Gender } from './enum/gender.enum';
import { NgForm } from '@angular/forms';
import { Student } from './interface/student';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$: Observable<AppSatate<CustomResponse>>;
  readonly DataState = DataState;
  readonly Gender = Gender;
  private dataSubject = new BehaviorSubject<CustomResponse | null>(null);
  selectedGender: Gender = Gender.ALL;

  constructor(private studentService: StudentService) {
    this.appState$ = of({ dataState: DataState.LOADING_STATE });
  }

  ngOnInit(): void {
    this.appState$ = this.studentService.students$.pipe(
      map((response) => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  saveStudent(studentForm: NgForm) {
    if (studentForm.valid) {
      const newStudent: Student = studentForm.value as Student;
  
      this.appState$ = this.studentService.add_new_student$(newStudent).pipe(
        map((response) => {
          const updatedStudents: Student[] = [
            ...(this.dataSubject.value?.data.students || []),
            response.data.student!
          ];
  
          this.dataSubject.next({
            ...response,
            data: {
              students: updatedStudents
            }
          });
  
          document.getElementById('closeModal')?.click();
          studentForm.resetForm();
  
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value! };
        }),
        startWith({ dataState: DataState.LOADING_STATE, appData: this.dataSubject.value! }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
    }
  }
  

  filterStudents(gender: Gender) {
    const data = this.dataSubject.value || ({ data: {} } as CustomResponse);
    this.appState$ = this.studentService.filter$(gender, data).pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE, appData: data }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }
}
