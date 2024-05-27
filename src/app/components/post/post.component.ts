import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../models/post/post.model';
import { OverlayModule } from '@angular/cdk/overlay';
import { LikeModalComponent } from '../like-modal/like-modal.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule, 
    MatChipsModule, 
    MatButtonModule, 
    MatIconModule,
    OverlayModule,
    LikeModalComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  isOpenLikes = signal(false);
  isOpenComments = signal(false);

  @Input({required: true}) post!: Post; 
  @Input({required: true}) isLogged!: boolean;


  openLikes(){
    this.isOpenLikes.update(prev => !prev);
  }
  openComments(){
    this.isOpenComments.update(prev => !prev);
  }

}
