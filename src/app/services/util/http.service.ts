import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment'

import { ToastrService } from 'ngx-toastr';
import { addCredentials } from '../../interceptors/credential.interceptor';



@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  get<T>(url: string, credentials=true): Observable<T>{
    let observable$ = new Observable<T>;
    if (credentials){
      observable$ = this.http.get<T>(`${environment.api_url}/${url}`);
    } else {
      observable$ = this.http.get<T>(`${environment.api_url}/${url}`, {context: addCredentials()});
    }
    return observable$.pipe(
      catchError(err => {
        return this.handleErrors(err);
      })
    );
  }

  post<T>(url:string, request: object, credentials=true): Observable<T>{
    let observable$ = new Observable<T>;
    if (credentials){
      observable$ = this.http.post<T>(`${environment.api_url}/${url}`, request)
    } else {
      observable$ = this.http.post<T>(`${environment.api_url}/${url}`, request, {context: addCredentials()})
    }
    return observable$.pipe(
      catchError(err => {
        return this.handleErrors(err);
      })
    );
  }

  put<T>(url:string, request: object, credentials=true): Observable<T>{
    let observable$ = new Observable<T>;
    if (credentials){
      observable$ = this.http.put<T>(`${environment.api_url}/${url}`, request)
    } else {
      observable$ = this.http.put<T>(`${environment.api_url}/${url}`, request, {context: addCredentials()})
    }
    return observable$.pipe(
      catchError(err => {
        return this.handleErrors(err);
      })
    );
  }

  patch<T>(url:string, request: object, credentials=true): Observable<T>{
    let observable$ = new Observable<T>;
    if (credentials){
      observable$ = this.http.patch<T>(`${environment.api_url}/${url}`, request)
    } else {
      observable$ = this.http.patch<T>(`${environment.api_url}/${url}`, request, {context: addCredentials()})
    }
    return observable$.pipe(
      catchError(err => {
        return this.handleErrors(err);
      })
    );
  }

  delete<T>(url:string, credentials=true): Observable<T>{
    let observable$ = new Observable<T>;
    if (credentials){
      observable$ = this.http.delete<T>(`${environment.api_url}/${url}`)
    } else {
      observable$ = this.http.delete<T>(`${environment.api_url}/${url}`, {context: addCredentials()})
    }
    return observable$.pipe(
      catchError(err => {
        return this.handleErrors(err);
      })
    );
  }

  private handleErrors(err: HttpErrorResponse){
    let detailError = '';
    if (err.status === 400){
      for (let key in err.error){
        detailError += `${key}: ${err.error[key as string][0]}`
        detailError += '\n';
      }
    } else if (err.error.hasOwnProperty('error')){
        detailError = err.error.error
    } else {
      detailError = err.error.detail
    }
    this.toastr.error(detailError, 'Error', {
      timeOut: 10000,
      extendedTimeOut: 5000,
      progressBar: true
    })
    return throwError(() => err.error);
  }

}
