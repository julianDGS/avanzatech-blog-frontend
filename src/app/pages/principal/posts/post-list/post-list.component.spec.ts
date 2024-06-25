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

fdescribe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postSvSpy: jasmine.SpyObj<PostService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  let storageSvSpy: jasmine.SpyObj<StorageService>;
  const user = generateOneUser();
  const pagPost = generatePaginatedPost();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    .compileComponents();
    
    fixture = TestBed.createComponent(PostListComponent);
    postSvSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    storageSvSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    storageSvSpy.get.and.resolveTo({id: user.id, nickname: user.name, teamId: user.team!.id});
    postSvSpy.listPosts.and.returnValue(of(pagPost));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create subscription, list no filtered posts and set user info on init', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.filterSubscription).toBeDefined();
    // flush();
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(1);
    fixture.detectChanges();
    expect(component.paginatedObject()).toEqual(pagPost);
    expect(component.isLogged()).toBeTrue();
  }));

  it('should have filter observable that emits a value after 300 ms to the observer', fakeAsync(() => {
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(1); //On Init
    component.filter$.next('');
    tick(100);
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(1);
    tick(200);
    expect(postSvSpy.listPosts).toHaveBeenCalledTimes(2);
    discardPeriodicTasks();
  }));

  it('should filter posts when filter observable emits a value', () => {

  });

  it('should not filter posts when filter observable emits a blank value', () => {

  });

  it('should change can_edit property when a user has not permissions', () => {

  });

  it('should list another post page when page change', () => {

  });

  it('should call service to delete a post when event is defined', () => {

  });

  it('shouldn ot call service to delete a post when evet is undefined', () => {

  });

  it('should show post add button when user is logged in', () => {

  });

  it('should show a spinner when loading is true and list of post when is false', () => {

  });

  it('should pass properties to post component', () => {

  });

  it('should listen for post component delete change', () => {

  });
});
