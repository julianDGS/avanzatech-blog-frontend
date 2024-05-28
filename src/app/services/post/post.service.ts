import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';
import { PaginatedPost, Post } from '../../models/post/post.model';

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

  getPost(postId: number){
    return this.http.get<Post>(`post/${postId}`);
  }

  deletePost(postId: number){
    return this.http.delete(`post/${postId}`)
  }
}
