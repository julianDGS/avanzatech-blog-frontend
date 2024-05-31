import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LikeService } from '../../services/like/like.service';
import { LikeModalComponent } from '../like-modal/like-modal.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Post } from '../../models/post/post.model';
import { PaginatedLike } from '../../models/like/like.model';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    MatButtonModule, 
    MatCardModule, 
    MatChipsModule, 
    MatDialogModule,
    MatIconModule,
    OverlayModule,

    LikeModalComponent,
    DeleteDialogComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  isOpenLikes = signal(false);
  isOpenComments = signal(false);
  paginatedLike?: PaginatedLike;

  @Input({required: true}) post?: Post; 
  @Input({required: true}) isLogged!: boolean;
  @Input() isDetail = false;
  @Input() canEdit = false;


  @Output() postDeleted = new EventEmitter<Post>()

  constructor(
    private likeSV: LikeService,
    private dialog: MatDialog
  ){}

  openLikes(){
    this.getLikes();
    this.isOpenLikes.update(prev => !prev);
  }

  openComments(){
    this.isOpenComments.update(prev => !prev);
  }

  onLikePageChanged(page: string){
    this.getLikes(page)
  }

  private getLikes(page='1'){
    this.likeSV.getLikes(page, String(this.post?.id)).subscribe( resp => {
      this.paginatedLike = resp
    })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Post',
        item: this.post?.title
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.postDeleted.emit(this.post);
      }
    });
  }


}
