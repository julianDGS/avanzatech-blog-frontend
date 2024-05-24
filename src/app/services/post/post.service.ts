import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';
import { PaginatedPost } from '../../models/post/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpService
  ) { }

  listPosts(pageNumber?: string){
    return this.http.get<PaginatedPost>(`post/?page=${pageNumber ? pageNumber : ''}`);
  }
}
