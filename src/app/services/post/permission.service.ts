import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';
import { PermissionResponse } from '../../models/post/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private http: HttpService
  ) { }

  getPermissions(){
    return this.http.get<PermissionResponse[]>('permission/');
  }

  getCategories(){
    return this.http.get<PermissionResponse[]>('permission/category/');
  }
}
