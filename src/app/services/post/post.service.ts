import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';
import { PaginatedPost, Post } from '../../models/post/post.model';
import { PostRequest, PostResponse } from '../../models/post/post-request.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpService
  ) { }

  listPosts(pageNumber?: string, filter?: string){
    let url =  'post/'
    if (pageNumber){
      url += `?page=${pageNumber}`
      if(filter){
        url += `&title=${filter}`
      }
    } else if (filter){
      url += `?title=${filter}`
    }
    return this.http.get<PaginatedPost>(url);
  }

  getPost(postId: number){
    return this.http.get<Post>(`post/${postId}/`);
  }

  deletePost(postId: number){
    return this.http.delete(`post/${postId}/`);
  }

  createPost(request: PostRequest){
    return this.http.post<PostResponse>('post/', request);
  }

  updatePost(postId: number, request: PostRequest){
    return this.http.put<PostResponse>(`post/${postId}/`, request)
  }
}
