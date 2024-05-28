import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../models/post/post.model';
import { OverlayModule } from '@angular/cdk/overlay';
import { LikeModalComponent } from '../like-modal/like-modal.component';
import { LikeService } from '../../services/like/like.service';
import { PaginatedLike } from '../../models/like/like.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule, 
    MatChipsModule, 
    MatButtonModule, 
    MatIconModule,
    OverlayModule,
    RouterLink,
    LikeModalComponent
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

  constructor(
    private likeSV: LikeService
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


}
