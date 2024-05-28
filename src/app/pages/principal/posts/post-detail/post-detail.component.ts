import { Component, OnInit, signal } from '@angular/core';
import { PostComponent } from '../../../../components/post/post.component';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../../services/post/post.service';
import { forkJoin, switchMap } from 'rxjs';
import { Post } from '../../../../models/post/post.model';
import { MatCardModule } from '@angular/material/card';
import { CommentService } from '../../../../services/comment/comment.service';
import { PaginatedComment } from '../../../../models/comment/comment.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
      CommonModule,
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      PostComponent,
      PaginatorComponent
    ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {

  itemsPerPage = 5;

  post = signal<Post | null>(null)
  paginatedComments = signal<PaginatedComment | null>(null)

  constructor(
    private activeRoute: ActivatedRoute,
    private postSV: PostService,
    private commentSV: CommentService
  ){}

  ngOnInit(): void {
     this.activeRoute.params
     .pipe(
        switchMap(({id}) => {
          const post$ = this.postSV.getPost(id);
          const comments$ = this.commentSV.getComments('1', id);
          return forkJoin([post$, comments$])
        })
      )
      .subscribe( ([respPost, respComment]) => {
        this.post.set(respPost)
        this.paginatedComments.set(respComment)
      })
    }
    
  private listComments(page='1'){
    if(this.post() !== null){
      this.commentSV.getComments(page, String(this.post()!.id));
    }
  }

  changePage(page: number){
    const pageStr = String(page)
    this.listComments(pageStr);
  }



}
