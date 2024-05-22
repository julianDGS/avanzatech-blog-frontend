import { Injectable } from '@angular/core';
import { AuthRequest, LoginResponse } from '../../models/auth/login.model';
import { MessageModel } from '../../models/util/message.model';
import { HttpService } from '../util/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpService
  ) { }

  login(request: AuthRequest){
    return this.http.post<LoginResponse>('user/login/', request);
  }

  logout(){
    return this.http.get<MessageModel>('user/logout/', false);
  }
}
