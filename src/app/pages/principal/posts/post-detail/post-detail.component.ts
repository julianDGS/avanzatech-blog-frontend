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
import { StorageService } from '../../../../services/util/storage.service';
import {MatDialogModule} from '@angular/material/dialog';

import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../components/delete-dialog/delete-dialog.component';


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
      MatDialogModule,
      
      PostComponent,
      DeleteDialogComponent,
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
  userId?: number;

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  constructor(
    private activeRoute: ActivatedRoute,
    private postSV: PostService,
    private commentSV: CommentService,
    private fb: FormBuilder,
    private toastrSV: ToastrService,
    private storageSV: StorageService,
    private dialog: MatDialog
  ){
    this.buildForm();
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
      this.storageSV.get('logged-user').then(resp => {
        this.userId = resp.id
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

  private deleteComment(id: number){
    this.commentSV.deleteComment(id).subscribe(() => {
      this.toastrSV.success('Comment deleted succesfully', 'Success', {
        progressBar: true
      })
      this.listComments();
    })
  }

  changePage(page: number){
    const pageStr = String(page)
    this.listComments(pageStr);
  }

  onSubmit(){
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
      })
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Comment',
        item: 'this comment'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteComment(id);
      }
    });
  }

 
}
