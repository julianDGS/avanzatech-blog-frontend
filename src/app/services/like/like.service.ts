import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';
import { Like, PaginatedLike } from '../../models/like/like.model';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  
  constructor(
    private http: HttpService
  ) { }
  
  getLikes(pageNumber: string, post_id: string, user_id=''){
    const url = `like/?page=${pageNumber}&post=${post_id}&user=${user_id}`
    return this.http.get<PaginatedLike>(url)
  }

  createLike(id: number) {
    return this.http.post<Like>('like/', {post_id: id});
  }

  deleteLike(postId: number) {
    return this.http.delete(`like/${postId}/`);
  }
}
