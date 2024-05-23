import { Injectable } from '@angular/core';
import { AuthRequest, LoginResponse } from '../../models/auth/login.model';
import { MessageModel } from '../../models/util/message.model';
import { HttpService } from '../util/http.service';
import { User } from '../../models/user/user.model';
import { StorageService } from '../util/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpService,
    private storageSV: StorageService,
    private router: Router
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

  isNoAuthAction(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const logged = await this.storageSV.get('logged-user');
      if (logged && logged !== '') {
          this.router.navigateByUrl('', {replaceUrl: true})
          resolve(false);
      } else {
        resolve(true);
      }  
    });
  }

}
