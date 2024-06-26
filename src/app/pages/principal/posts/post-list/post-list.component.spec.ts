import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';

import { PostListComponent } from './post-list.component';
import { PostService } from '../../../../services/post/post.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../../services/util/storage.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { generateOneUser } from '../../../../models/user/user.mock';
import { generatePaginatedPost } from '../../../../models/post/post.mock';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { findAllComponents, findComponent } from '../../../../util/find-component';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postSvSpy: jasmine.SpyObj<PostService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  let storageSvSpy: jasmine.SpyObj<StorageService>;
  const user = generateOneUser();
  const pagPost = generatePaginatedPost();

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        {provide: PostService, useValue: jasmine.createSpyObj('postSV', ['listPosts', 'deletePost'])},
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrSV', ['success'])},
        {provide: StorageService, useValue: jasmine.createSpyObj('storageSV', ['get'])}
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(PostListComponent);
      postSvSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
      toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
      storageSvSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
      storageSvSpy.get.and.resolveTo({id: user.id, nickname: user.name, teamId: user.team!.id});
      postSvSpy.listPosts.and.returnValue(of({...pagPost}));
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.loading()).toBeTrue();
      tick(500);
      expect(component.loading()).toBeFalse();
    });
    
  }));

  afterEach(() => {
    component.ngOnDestroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should create subscription, list no filtered posts and set user info on init', () => {
    expect(component.filterSubscription).toBeDefined();
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(1);
    expect(component.paginatedPost()).toEqual(pagPost);
    expect(component.isLogged()).toBeTrue();
  });

  it('should filter posts after 300 ms when filter observable emits a value', fakeAsync(() => {
    component.filter.nativeElement.value = 'abc';
    component.onFilter();
    tick(600); //300 from list post delay and 300 for debounceTime
    expect(postSvSpy.listPosts).toHaveBeenCalledWith('1', 'abc');
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(2);
  }));

  it('should not filter posts when filter observable emits a blank value', fakeAsync(() => {
    component.filter.nativeElement.value = '';
    component.onFilter();
    tick(600); //300 from list post delay and 300 for debounceTime
    expect(postSvSpy.listPosts).toHaveBeenCalledWith('1', undefined);
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(2);
  }));

  it('should change can_edit property when a user has not permissions', () => {
    const posts = [...component.paginatedPost()!.results];
    const postIds = posts.filter(post => post.can_edit === true).map(post => post.id);
    const canEditPosts = pagPost.results.filter(post => {
      return (post.author.id === user.id && post.permissions.author.name === 'edit') ||
      (post.author.team?.id === user.team!.id && post.permissions.team.name === 'edit') ||
      (post.permissions.auth.name === 'edit')
    }).map(post => post.id);
    expect(postIds.length).toEqual(canEditPosts.length);
    expect(postIds.sort()).toEqual(canEditPosts.sort());
  });

  it('should list another post page when page change', () => {
    component.changePage(2);
    expect(postSvSpy.listPosts).toHaveBeenCalledWith('2', undefined);
  });

  it('should listen for post component delete and call service when event is defined', () => {
    fixture.detectChanges();
    const postComp = findComponent(fixture, 'app-post');
    const postSelected = pagPost.results[0];
    postSvSpy.deletePost.and.returnValue(of(null));
    postComp.triggerEventHandler('postDeleted', postSelected);
    expect(postSvSpy.deletePost).toHaveBeenCalledOnceWith(postSelected.id)
    expect(toastrSvSpy.success).toHaveBeenCalledOnceWith(`${postSelected.title} deleted succesfully`, 'Success', {progressBar: true});
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(2);
  });

  it('should listen for post component delete and do not call service when event is not defined', () => {
    fixture.detectChanges();
    const postComp = findComponent(fixture, 'app-post');
    postSvSpy.deletePost.and.returnValue(of(null));
    postComp.triggerEventHandler('postDeleted', undefined);
    expect(postSvSpy.deletePost).not.toHaveBeenCalled();
    expect(toastrSvSpy.success).not.toHaveBeenCalled();
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(1);
  });

  it('should show post add button when user is logged in', () => {
    fixture.detectChanges();
    const postComp = findComponent(fixture, 'app-post');
    postSvSpy.deletePost.and.returnValue(of(null));
    postComp.triggerEventHandler('postDeleted', undefined);
    expect(postSvSpy.deletePost).not.toHaveBeenCalled();
    expect(toastrSvSpy.success).not.toHaveBeenCalled();
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(1);
  });

  it('should pass properties to post component', () => {
    fixture.detectChanges();
    const postComp = findComponent(fixture, 'app-post').componentInstance;
    const firstPost = component.paginatedPost()!.results[0]; 
    expect(postComp.isLogged).toEqual(component.isLogged());
    expect(postComp.post).toEqual(firstPost);
    expect(postComp.canEdit).toEqual(firstPost.can_edit);
  });

  it('should show as many post components as posts results', () => {
    fixture.detectChanges();
    const postComps = findAllComponents(fixture, 'app-post');
    expect(postComps.length).toEqual(component.paginatedPost()!.results.length);
  });

});
