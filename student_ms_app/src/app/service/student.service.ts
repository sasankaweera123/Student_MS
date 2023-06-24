import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-response';
import { Student } from '../interface/student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  // get all students
  students$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.baseUrl}/student/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  // get student by id
  student$ = (id: number) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.baseUrl}/student/${id}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  // add new student
  add_new_student$ = (student: Student) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.baseUrl}/student`, student)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  // update student
  update_student$ = (student: Student) =>
    <Observable<CustomResponse>>(
      this.http
        .put<CustomResponse>(`${this.baseUrl}/student`, student)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  // delete student
  delete_student$ = (id: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.baseUrl}/student/${id}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`Wait.... I fucked up - Error code: ${error.status}`);
  }
}
