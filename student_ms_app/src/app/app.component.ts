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
import { formatDate } from '@angular/common';
import { GoogleApiService } from './service/google-api.service';
import { UserProfile } from './interface/user-profile';

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
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  userInfo?: UserProfile;

  constructor(private studentService: StudentService) {
    this.appState$ = of({ dataState: DataState.LOADING_STATE });
  }

  ngOnInit(): void {
    this.appState$ = this.studentService.students$.pipe(
      map((response) => {
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED_STATE,
          appData: {
            ...response,
            data: { students: response.data.students?.reverse() },
          },
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  saveStudent(studentForm: NgForm) {
    this.isLoading.next(true);
    if (studentForm.valid) {
      const newStudent: Student = studentForm.value as Student;

      console.log(newStudent);

      this.appState$ = this.studentService.add_new_student$(newStudent).pipe(
        map((response) => {
          const updatedStudents: Student[] = [
            ...(this.dataSubject.value?.data.students || []),
            response.data.student!,
          ];

          this.dataSubject.next({
            ...response,
            data: {
              students: updatedStudents,
            },
          });

          document.getElementById('closeModal')?.click();
          this.isLoading.next(false);
          studentForm.resetForm();

          return {
            dataState: DataState.LOADED_STATE,
            appData: this.dataSubject.value!,
          };
        }),
        startWith({
          dataState: DataState.LOADING_STATE,
          appData: this.dataSubject.value!,
        }),
        catchError((error: string) => {
          this.isLoading.next(false);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
    }
  }

  deleteStudent(student: Student): void {
    this.appState$ = this.studentService.delete_student$(student.id).pipe(
      map((response) => {
        this.dataSubject.next({
          ...response,
          data: {
            students: this.dataSubject.value?.data.students?.filter(
              (s) => s.id !== student.id
            ),
          },
        });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value!,
        };
      }),
      startWith({
        dataState: DataState.LOADING_STATE,
        appData: this.dataSubject.value!,
      }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
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

  printReport(): void {
    window.print();
    // let dataType =
    //   'application/vnd.ms-excel.sheet.macroEnabled.12';
    // let fileName = 'students.xls';
    // let tableSelect = document.getElementById('students');
    // let tableHTML = tableSelect?.outerHTML.replace(/ /g, '%20');
    // let downloadLink = document.createElement('a');

    // document.body.appendChild(downloadLink);
    // downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    // downloadLink.download = fileName;
    // downloadLink.click();
    // document.body.removeChild(downloadLink);
  }

  // logOut(): void {
  //   this.googleApi.signOut();
  // }
}
