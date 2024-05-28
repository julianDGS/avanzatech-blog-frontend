import { Injectable } from '@angular/core';
import { HttpService } from '../util/http.service';
import { PaginatedLike } from '../../models/like/like.model';
import { PaginatedComment } from '../../models/comment/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpService
  ) { }

  getComments(pageNumber: string, post_id: string, user_id=''){
    const url = `comment/?page=${pageNumber ? pageNumber : ''}&post=${post_id}&user=${user_id}`
    return this.http.get<PaginatedComment>(url, false)
  }
}
