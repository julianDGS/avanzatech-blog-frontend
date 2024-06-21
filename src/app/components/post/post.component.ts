import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

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
import { finalize } from 'rxjs';

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
export class PostComponent implements AfterViewChecked{

  isOpenLikes = signal(false);
  paginatedLike?: PaginatedLike;
  loadingLikes = signal(false);
  // likeMap: {[k: string]: string} = {
  //   '=0': 'No Likes',
  //   '=1': '1',
  //   'other': '# Likes',
  // };
  // commentMap: {[k: string]: string} = {
  //   '=0': 'No Comments',
  //   '=1': '1 Comment',
  //   'other': '# Comments',
  // };

  @Input({required: true}) post?: Post; 
  @Input({required: true}) isLogged!: boolean;
  @Input() isDetail = false;
  @Input() canEdit = false;


  @Output() postDeleted = new EventEmitter<Post>()
  @ViewChild('detail') detailElement!: ElementRef<HTMLSpanElement>

  constructor(
    private likeSV: LikeService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private router: Router
  ){}

  ngAfterViewChecked(): void {
    this.setContent();
  }

  openLikes(){
    if(this.post?.likes && this.post.likes > 0){
      this.getLikes();
      this.isOpenLikes.update(prev => !prev);
    }
  }

  onLikePageChanged(page: string){
    this.getLikes(page)
  }

  private getLikes(page='1'){
    this.loadingLikes.set(true);
    this.likeSV.getLikes(page, String(this.post?.id))
    .pipe(
      finalize(() => this.loadingLikes.set(false))
    )
    .subscribe( resp => {
      this.paginatedLike = resp
    })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'Delete Post',
        item: `Would you like to delete ${this.post?.title}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.postDeleted.emit(this.post);
      }
    });
  }

  onLikeAction(){
    if(this.post!.post_liked){
      this.likeSV.deleteLike(this.post!.id).subscribe(() => {
        this.post!.post_liked = false;
        this.post!.likes -= 1;
      });
    } else {
      this.likeSV.createLike(this.post!.id).subscribe(() => {
        this.post!.post_liked = true;
        this.post!.likes += 1;
      });
    }
  }

  setContent(){
    if(this.isDetail){
      this.detailElement.nativeElement.innerHTML = this.post?.content_html || '';
    } else {
      this.detailElement.nativeElement.innerHTML = this.post?.excerpt || '';
      if(this.post?.excerpt?.length! < this.post?.content_html?.length!){
        this.createButton()
      }
    }
  }

  private createButton(): void {
    const button = this.renderer.createElement('a');
    const text = this.renderer.createText('... Show more');
    this.renderer.addClass(button, 'mdc-button');
    this.renderer.addClass(button, 'mat-mdc-button');
    this.renderer.addClass(button, 'mat-unthemed');
    this.renderer.addClass(button, 'mat-mdc-button-base');
    this.renderer.addClass(button, 'button-link');
    this.renderer.listen(button, 'click', (event) => {
      event.preventDefault();
      this.router.navigate(['/p/detail', this.post?.id]);
    });
    this.renderer.appendChild(button, text);
    this.renderer.appendChild(this.detailElement.nativeElement, button);
  }

}
