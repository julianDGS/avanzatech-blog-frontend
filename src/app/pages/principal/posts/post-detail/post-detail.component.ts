import { Component, OnInit, ViewChild, signal } from '@angular/core';
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
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
      CommonModule,
      ReactiveFormsModule,

      MatCardModule,
      MatIconModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      
      PostComponent,
      PaginatorComponent
    ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {

  itemsPerPage = 5;
  commentForm!: FormGroup;
  post = signal<Post | null>(null)
  paginatedComments = signal<PaginatedComment | null>(null)

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  constructor(
    private activeRoute: ActivatedRoute,
    private postSV: PostService,
    private commentSV: CommentService,
    private fb: FormBuilder,
    private toastrSV: ToastrService
  ){
    this.buildForm();
    console.log(this.commentForm)
  }

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

  private buildForm(){
    this.commentForm = this.fb.group({
      comment: [null, [Validators.required]]
    })
  }
    
  private listComments(page='1'){
    if(this.post() !== null){
      this.commentSV.getComments(page, String(this.post()!.id)).subscribe(resp => {
        this.paginatedComments.set(resp);
      });
    }
  }

  changePage(page: number){
    const pageStr = String(page)
    this.listComments(pageStr);
  }

  onSubmit(){
    console.log(this.commentForm.value)
    if(!this.commentForm.pristine){
      let request: {post_id: number, comment: string} = {
        post_id: this.post()!.id,
        comment: this.commentForm.value.comment
      };
      this.commentSV.createComment(request).subscribe(() => {
        this.toastrSV.success('Comment created succesfully', 'Success', {
          progressBar: true
        })
        this.listComments();
        this.formDir.resetForm();
        console.log(this.commentForm)
      })
    }
  }



}
