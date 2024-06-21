import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PostComponent } from './post.component';
import { LikeService } from '../../services/like/like.service';
import { Router, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DebugElement, Renderer2 } from '@angular/core';
import { generatePaginatedLike } from '../../models/like/like.mock';
import { generateOnePost } from '../../models/post/post.mock';
import { Post } from '../../models/post/post.model';
import { By } from '@angular/platform-browser';
import { defer, delay, of } from 'rxjs';

fdescribe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let likeSvSpy: jasmine.SpyObj<LikeService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let post: Post;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
      providers: [
        provideRouter([]),
        {
          provide: LikeService, 
          useValue: jasmine.createSpyObj('likeSV', ['getLikes', 'deleteLike', 'createLike'])
        },
        {
          provide: MatDialog, 
          useValue: jasmine.createSpyObj('dialog', ['open'])
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostComponent);
    likeSvSpy = TestBed.inject(LikeService) as jasmine.SpyObj<LikeService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    component = fixture.componentInstance;
    post = generateOnePost();
    component.paginatedLike = generatePaginatedLike();
    component.post = post;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load content with show-more-button after view checked', () => {
    const anchor = component.detailElement.nativeElement.children[0];
    expect(component.detailElement.nativeElement.innerText).toEqual(post.excerpt+"... Show more");
    expect(anchor.tagName).toEqual('A');
    expect(anchor.innerHTML).toEqual('... Show more');
  });

  it('should open overlay with likes on like-button click', fakeAsync(() => {
    component.paginatedLike = undefined;
    const paginatedLike = generatePaginatedLike();
    likeSvSpy.getLikes.and.returnValue(defer(() => of(paginatedLike)).pipe(delay(0)));
    const overlay = fixture.debugElement.query(By.css('app-like-modal'));
    component.openLikes();
    fixture.detectChanges();
    expect(component.loadingLikes()).toBeTruthy();
    expect(likeSvSpy.getLikes).toHaveBeenCalledOnceWith('1', String(post.id));
    tick();
    expect(component.paginatedLike!).toEqual(paginatedLike);
    expect(component.loadingLikes()).toBeFalsy();
    expect(overlay).toBeDefined();
  }));

  it('should not open overlay with likes if length is zero', () => {
    component.paginatedLike = undefined;
    const overlay = fixture.debugElement.query(By.css('app-like-modal'));
    component.openLikes();
    fixture.detectChanges();
    expect(component.loadingLikes()).toBeFalsy();
    expect(likeSvSpy.getLikes).not.toHaveBeenCalled();
    expect(component.paginatedLike!).toBeUndefined();
    expect(overlay).not.toBeDefined();
  });

  it('should get new page of likes when page changed', () => {
    component.onLikePageChanged('2');
    const secondPage = generatePaginatedLike();
    likeSvSpy.getLikes.and.returnValue(of(secondPage));
    expect(likeSvSpy.getLikes).toHaveBeenCalledOnceWith('2', String(post.id));
    expect(component.paginatedLike).toEqual(secondPage);
  });

  it('should call service to create like', () => {
    component.onLikeAction();
    expect(likeSvSpy.deleteLike).toHaveBeenCalledOnceWith(post.id);
    expect(component.post?.post_liked).toBeFalsy();
    expect(component.post?.likes).toEqual(post.likes - 1);
  });

  it('should call service to delete like', () => {
    component.post!.post_liked = false;
    component.onLikeAction();
    expect(likeSvSpy.createLike).toHaveBeenCalledOnceWith(post.id);
    expect(component.post?.post_liked).toBeTruthy();
    expect(component.post?.likes).toEqual(post.likes + 1);
  });

  describe('', () => {
    let commentBtn: DebugElement;
    let likeBtn: DebugElement;
    let commentAnchor: DebugElement;
    let editAnchor: DebugElement;
    let deleteBtn: DebugElement;

    beforeEach(() => {
      commentBtn = fixture.debugElement.query(By.css('a[test-id="comment-btn"]'));
      likeBtn = fixture.debugElement.query(By.css('btn[test-id="like-btn"]'));
      commentAnchor = fixture.debugElement.query(By.css('a[test-id="comment-a"]'));
      editAnchor = fixture.debugElement.query(By.css('a[test-id="edit-a"]'));
      deleteBtn = fixture.debugElement.query(By.css('btn[test-id="delete-btn"]'));
    })

    it('should show all data in html when is not detail', () => {
      component.isLogged = true;
      component.canEdit = true;
      fixture.detectChanges();
    });
  
    it('should show some data in html when is detail', () => {
  
    });
  
    it('should show dialog and delete post when true is emitted', () => {
      
    });
  
    it('should show dialog and not delete post when false is emitted', () => {
  
    });
  
    it('should not show edit and delete buttons when user is not allowed', () => {
  
    });
  
    it('should not show like and comment buttons when user is not logged in', () => {
  
    });
  
    it('should not show comment button and number of comments when it is not detail', () => {
  
    });
  })


});
