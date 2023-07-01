import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-response';
import { Student } from '../interface/student';
import { Gender } from '../enum/gender.enum';

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

  // filter students
  filter$ = (
    gender: Gender,
    response: CustomResponse
  ): Observable<CustomResponse> =>
    new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      if (response.data.students) {
        subscriber.next(
          gender === Gender.ALL
            ? { ...response, message: `Students filtered by ${gender} Gender` }
            : {
                ...response,
                message:
                  response.data.students.filter(
                    (student) => student.gender === gender
                  ).length > 0
                    ? `Students filtered by ${
                        gender === Gender.FEMALE
                          ? 'Female'
                          : gender === Gender.MALE
                          ? 'Male'
                          : 'Other'
                      } Gender`
                    : `No Students of ${gender} found`,
                data: {
                  students: response.data.students.filter(
                    (student) => student.gender === gender
                  ),
                },
              }
        );
      } else {
        subscriber.next(response); // Pass the original response if students is undefined
      }
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`Wait.... I fucked up - Error code: ${error.status}`);
  }
}
