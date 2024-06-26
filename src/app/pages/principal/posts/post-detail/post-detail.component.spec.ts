import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../../../../services/post/post.service';
import { CommentService } from '../../../../services/comment/comment.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../../services/util/storage.service';
import { ActivatedRoute } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { generateOnePost } from '../../../../models/post/post.mock';
import { generateOneComment, generatePaginatedComment } from '../../../../models/comment/comment.mock';
import { LikeService } from '../../../../services/like/like.service';
import { findAllComponents, findComponent } from '../../../../util/find-component';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postSvSpy: jasmine.SpyObj<PostService>;
  let commentSvSpy: jasmine.SpyObj<CommentService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  let storageSvSpy: jasmine.SpyObj<StorageService>;
  const post = generateOnePost(1);
  const pagComment = generatePaginatedComment();
  const paramId = 1;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [PostDetailComponent],
      providers: [
        provideAnimations(),
        {provide: PostService, useValue: jasmine.createSpyObj('PostService', ['getPost']) },
        {provide: CommentService, useValue: jasmine.createSpyObj('CommentService', ['getComments', 'deleteComment', 'createComment']) },
        {provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success']) },
        {provide: StorageService, useValue: jasmine.createSpyObj('StorageService', ['get']) },
        {provide: LikeService, useValue: jasmine.createSpyObj('LikeService', ['getLikes']) },
        {
          provide: ActivatedRoute, 
          useValue: jasmine.createSpyObj(
            'ActivatedRoute', 
            [], 
            {params: new Observable(suscriber => suscriber.next({id: paramId}))})
        }
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(PostDetailComponent);
      postSvSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
      commentSvSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
      toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
      storageSvSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
      
      postSvSpy.getPost.and.returnValue(of(post));
      commentSvSpy.getComments.and.returnValue(of(pagComment));
      storageSvSpy.get.and.resolveTo({id: 1});
      
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.loading()).toBeTrue();
      tick(300);
      expect(component.loading()).toBeFalse();
      flush();
    });
    
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call post and comments service on init', () => {
    expect(postSvSpy.getPost).toHaveBeenCalledOnceWith(paramId);
    expect(commentSvSpy.getComments).toHaveBeenCalledOnceWith('1', String(paramId));
  });

  it('should set post and paginated object on init', () => {
    expect(component.post()).toEqual(post);
    expect(component.paginatedComments()).toEqual(pagComment);
  });

  it('should set loading false when error on init', fakeAsync(() => {
    postSvSpy.getPost.and.returnValue(throwError(() => 'error'));
    commentSvSpy.getComments.and.returnValue(of(pagComment));
    component.ngOnInit();
    expect(component.loading()).toBeTrue();
    tick(300);
    expect(component.loading()).toBeFalse();
  }));

  it('should set user id on init', () => {
    expect(component.userId).toEqual(1);
  });

  it('should have a valid form if all controls are valid', () => {
    const value = {comment: 'commentary'};
    component.commentForm.setValue(value);
    expect(component.commentForm.valid).toBeTrue();
  });

  it('should have an invalid form if any control is invalid', () => {
    const value = {comment: null};
    component.commentForm.setValue(value);
    expect(component.commentForm.valid).toBeFalse();
  });

  it('should list new page of comments on page change', fakeAsync(() => {
    const pageTwo = generatePaginatedComment();
    commentSvSpy.getComments.and.returnValue(of(pageTwo));
    expect(component.paginatedComments()).toEqual(pagComment);
    component.changePage(2);
    expect(component.loadingComments()).toBeTrue();
    expect(commentSvSpy.getComments).toHaveBeenCalledWith('2', String(post.id));
    tick(400);
    expect(component.loadingComments()).toBeFalse();
    expect(component.paginatedComments()).toEqual(pageTwo);
  }));

  it('should call service to create comment, reset form and list comments', () => {
    fixture.detectChanges();
    const value = {comment: 'commentary'};
    spyOn(component.formDir!, 'resetForm').and.callThrough();
    component.commentForm.setValue(value);
    component.commentForm.markAsDirty();
    commentSvSpy.createComment.and.returnValue(of(generateOneComment()));
    component.onSubmit();
    expect(commentSvSpy.createComment).toHaveBeenCalledOnceWith({post_id: post.id, comment: value.comment});
    expect(toastrSvSpy.success).toHaveBeenCalledOnceWith('Comment created succesfully', 'Success', {progressBar: true});
    expect(commentSvSpy.getComments).toHaveBeenCalledWith('1', String(post.id));
    expect(component.formDir!.resetForm).toHaveBeenCalledTimes(1);
    expect(component.commentForm.value).toEqual({comment: null});
  });

  it('should open dialog to delete comment and delete if dialog emits true', () => {
    const mockDialogRef = jasmine.createSpyObj({afterClosed: of(true)})
    spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);
    commentSvSpy.deleteComment.and.returnValue(of(null));
    component.openDialog('0ms', '0ms', post.id);
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(commentSvSpy.deleteComment).toHaveBeenCalledOnceWith(post.id);
    expect(toastrSvSpy.success).toHaveBeenCalledOnceWith('Comment deleted succesfully', 'Success', {progressBar: true});
    expect(commentSvSpy.getComments).toHaveBeenCalledWith('1', String(post.id));
  });

  it('should open dialog to delete comment and not delete if dialog emits false', () => {
    const mockDialogRef = jasmine.createSpyObj({afterClosed: of(false)})
    spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);
    commentSvSpy.deleteComment.and.returnValue(of(null));
    component.openDialog('0ms', '0ms', post.id);
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(commentSvSpy.deleteComment).not.toHaveBeenCalled();
    expect(toastrSvSpy.success).not.toHaveBeenCalled();
  });

  it('should load post component with correct properties', () => {
    fixture.detectChanges();
    const postComp = findComponent(fixture, 'app-post');
    expect(postComp.componentInstance.isLogged).toBeTrue();
    expect(postComp.componentInstance.isDetail).toBeTrue();
    expect(postComp.componentInstance.post).toEqual(post);
  });

  it('should load comment form if user is logged in', () => {
    fixture.detectChanges();
    const commentForm = findComponent(fixture, 'form');
    expect(commentForm).toBeDefined();
  });

  it('should not load comment form if user is not logged in', () => {
    component.userId = undefined;
    fixture.detectChanges();
    const commentForm = findComponent(fixture, 'form');
    expect(commentForm).toBeNull();
  });

  it('should show only loading if loading is true', () => {
    const loadingComps = findAllComponents(fixture, 'mat-spinner');
    expect(loadingComps.length).toEqual(1);
  });

  it('should show loading and not comments if loading comments is true', () => {
    component.loadingComments.set(true);
    fixture.detectChanges();
    const loadingComp = findComponent(fixture, 'div > mat-spinner');
    expect(loadingComp).toBeDefined();
  });

  it('should load comments if loading is false', () => {
    fixture.detectChanges();
    const loadingComp = findComponent(fixture, 'div > mat-spinner');
    const commentCard = findComponent(fixture, 'div > mat-card');
    expect(loadingComp).toBeNull();
    expect(commentCard).toBeDefined();
  });

  it('should load comments if loading comments is false', () => {
    const loadingComp = findComponent(fixture, 'div > mat-spinner');
    const commentCard = findComponent(fixture, 'div > mat-card');
    expect(loadingComp).toBeNull();
    expect(commentCard).toBeDefined();
  });


});
