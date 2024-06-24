import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PostComponent } from './post.component';
import { LikeService } from '../../services/like/like.service';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { generateOneLike, generatePaginatedLike } from '../../models/like/like.mock';
import { generateOnePost } from '../../models/post/post.mock';
import { Post } from '../../models/post/post.model';
import { By } from '@angular/platform-browser';
import { defer, delay, of } from 'rxjs';


// class DialogMock {
//   open() {
//     return {
//       afterClosed: () => of(true)
//     };
//   }
// };

fdescribe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let likeSvSpy: jasmine.SpyObj<LikeService>;
  // let dialogSpy: DialogMock;
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
        // {
        //   provide: MatDialog, 
        //   useClass: DialogMock
        // }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostComponent);
    likeSvSpy = TestBed.inject(LikeService) as jasmine.SpyObj<LikeService>;
    // dialogSpy = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    post = generateOnePost();
    component.paginatedLike = generatePaginatedLike();
    component.post = {...post};
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
    component.post!.likes = 0;
    likeSvSpy.getLikes.and.returnValue(of(generatePaginatedLike()));
    const overlay = fixture.debugElement.query(By.css('app-like-modal'));
    component.openLikes();
    fixture.detectChanges();
    expect(component.loadingLikes()).toBeFalsy();
    expect(likeSvSpy.getLikes).not.toHaveBeenCalled();
    expect(component.paginatedLike!).toBeUndefined();
    expect(overlay).toBeNull();
  });

  it('should get new page of likes when page changed', fakeAsync(() => {
    const secondPage = generatePaginatedLike();
    likeSvSpy.getLikes.and.returnValue(defer(() => of(secondPage)).pipe(delay(0)));
    component.onLikePageChanged('2');
    expect(component.loadingLikes()).toBeTrue();
    expect(likeSvSpy.getLikes).toHaveBeenCalledOnceWith('2', String(post.id));
    tick();
    expect(component.loadingLikes()).toBeFalse();
    expect(component.paginatedLike).toEqual(secondPage);
  }));

  it('should call service to delete like', () => {
    likeSvSpy.deleteLike.and.returnValue(of(null));
    component.onLikeAction();
    expect(likeSvSpy.deleteLike).toHaveBeenCalledOnceWith(post.id);
    expect(component.post?.post_liked).toBeFalsy();
    expect(component.post?.likes).toEqual(post.likes - 1);
  });

  it('should call service to create like', () => {
    likeSvSpy.createLike.and.returnValue(of(generateOneLike()));
    component.post!.post_liked = false;
    component.onLikeAction();
    expect(likeSvSpy.createLike).toHaveBeenCalledOnceWith(post.id);
    expect(component.post?.post_liked).toBeTruthy();
    expect(component.post?.likes).toEqual(post.likes + 1);
  });

  describe('', () => {

    beforeEach(() => {
      component.isLogged = true;
      component.canEdit = true;
      fixture.detectChanges();
    })

    it('should show all data in html when is not detail', () => {
      const commentBtn = fixture.debugElement.query(By.css('a[test-id="comment-btn"]'));
      const likeBtn = fixture.debugElement.query(By.css('button[test-id="like-btn"]'));
      const commentAnchor = fixture.debugElement.query(By.css('a[test-id="comment-a"]'));
      const editAnchor = fixture.debugElement.query(By.css('a[test-id="edit-a"]'));
      const deleteBtn = fixture.debugElement.query(By.css('button[test-id="delete-btn"]'));
      expect(commentBtn.properties['innerText']).toEqual(`forum\n${post.comments}`);
      expect(likeBtn.attributes['ng-reflect-color']).toEqual('warn');
      expect(commentAnchor.attributes['ng-reflect-router-link']).toEqual(`/p/detail,${post.id}`);
      expect(editAnchor).toBeDefined();
      expect(deleteBtn).toBeDefined();
    });
  
    it('should not show comment buttons when is detail', () => {
      component.isDetail = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('a[test-id="comment-btn"]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('a[test-id="comment-a"]'))).toBeNull();
    });

    it('should not show edit and delete buttons when user is not allowed', () => {
      component.canEdit = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('a[test-id="edit-a"]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('button[test-id="delete-btn"]'))).toBeNull();
    });
  
    it('should not show like and comment buttons when user is not logged in', () => {
      component.isLogged = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('a[test-id="comment-a"]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('button[test-id="like-btn"]'))).toBeNull();
    });
  
    it('should show dialog and delete post when true is emitted', () => {
      const mockDialogRef = jasmine.createSpyObj({afterClosed: of(true)})
      spyOn(component.postDeleted, 'emit');
      spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);
      component.openDialog('0ms', '0ms');
      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();
      expect(component.postDeleted.emit).toHaveBeenCalledOnceWith(post);
    });
  
    it('should show dialog and not delete post when false is emitted', () => {
      const mockDialogRef = jasmine.createSpyObj({afterClosed: of(false)})
      spyOn(component.postDeleted, 'emit');
      spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);
      component.openDialog('0ms', '0ms');
      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();
      expect(component.postDeleted.emit).not.toHaveBeenCalled();
    });
  })


});
