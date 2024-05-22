import { Injectable } from '@angular/core';
import { AuthRequest, LoginResponse } from '../../models/auth/login.model';
import { MessageModel } from '../../models/util/message.model';
import { HttpService } from '../util/http.service';
import { User } from '../../models/user/user.model';

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
    return this.http.get<MessageModel>('user/logout/');
  }

  register(request: AuthRequest){
    return this.http.post<User>('user/register/', request, false)
  }
}
