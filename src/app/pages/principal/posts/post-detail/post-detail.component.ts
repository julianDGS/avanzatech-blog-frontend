import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { delay, finalize, forkJoin, switchMap } from 'rxjs';

import { PostService } from '../../../../services/post/post.service';
import { CommentService } from '../../../../services/comment/comment.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../../services/util/storage.service';
import { Post } from '../../../../models/post/post.model';
import { PostComponent } from '../../../../components/post/post.component';
import { DeleteDialogComponent } from '../../../../components/delete-dialog/delete-dialog.component';

import { MatCardModule } from '@angular/material/card';
import { PaginatedComment } from '../../../../models/comment/comment.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



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
      MatTooltipModule,
      MatProgressSpinnerModule,
      
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
  userId?: number;
  loading = signal(false);
  loadingComments = signal(false)

  @ViewChild(FormGroupDirective) formDir?: FormGroupDirective;

  constructor(
    private activeRoute: ActivatedRoute,
    private postSV: PostService,
    private commentSV: CommentService,
    private fb: FormBuilder,
    private toastrSV: ToastrService,
    private storageSV: StorageService,
    public dialog: MatDialog
  ){
    this.buildForm();
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.activeRoute.params
    .pipe(
      delay(300),
      switchMap(({id}) => {
        const post$ = this.postSV.getPost(id);
        const comments$ = this.commentSV.getComments('1', String(id));
        return forkJoin([post$, comments$])
      }),
    )
    .subscribe({
      next:  ([respPost, respComment]) => {
        this.post.set(respPost)
        this.paginatedComments.set(respComment)
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    })

    this.storageSV.get('logged-user').then(resp => {
      if(resp && resp !== null){
        this.userId = resp.id
      }
    })
  }

  private buildForm(){
    this.commentForm = this.fb.group({
      comment: [null, [Validators.required]]
    })
  }
    
  private listComments(page='1'){
    if(this.post() !== null){
      this.loadingComments.set(true);
      this.commentSV.getComments(page, String(this.post()!.id))
      .pipe(
        delay(300),
        finalize(() => this.loadingComments.set(false))
      )
      .subscribe(resp => {
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
        this.resetForm();
      })
    }
  }

  resetForm(){
    this.formDir?.resetForm();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Delete Comment',
        item: 'Would you like to delete this comment?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteComment(id);
      }
    });
  }

 
}
