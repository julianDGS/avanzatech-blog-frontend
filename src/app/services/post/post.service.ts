import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpService
  ) { }

  listPosts(pageNumber?: string){
    return this.http.get(`post/?page=${pageNumber ? pageNumber : ''}`);
  }
}
