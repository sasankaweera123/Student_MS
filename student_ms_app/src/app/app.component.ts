import { Component, OnInit } from '@angular/core';
import { StudentService } from './service/student.service';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { AppSatate } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { DataState } from './enum/dataState';
import { Gender } from './enum/gender.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$: Observable<AppSatate<CustomResponse>>;
  readonly DataState = DataState;
  readonly Gender = Gender;

  constructor(private studentService: StudentService) {
    this.appState$ = of({ dataState: DataState.LOADING_STATE });
  }

  ngOnInit(): void {
    this.appState$ = this.studentService.students$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError((error: string)=>{
        return of({dataState: DataState.ERROR_STATE,error: error})
      })
    );
  }
}
