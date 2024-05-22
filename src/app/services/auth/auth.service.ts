import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest, LoginResponse } from '../../models/auth/login.model';
import { environment } from '../../../environments/environment'
import { MessageModel } from '../../models/util/message.model';

import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  login(request: AuthRequest){
    return this.http.post<LoginResponse>(`${environment.api_url}/user/login/`, request, {withCredentials: true});
  }

  logout(){
    return this.http.get<MessageModel>(`${environment.api_url}/user/logout/`, {withCredentials: true}).pipe(
      catchError(err => {
        this.snackBar.open(err, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return throwError(() => err);
      })
    );
  }
}
