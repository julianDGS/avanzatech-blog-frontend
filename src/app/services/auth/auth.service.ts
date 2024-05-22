import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest, LoginResponse } from '../../models/auth/login.model';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(request: AuthRequest){
    return this.http.post<LoginResponse>(`${environment.api_url}/user/login/`, request, {withCredentials: true});
  }
}
