import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { PostCreateComponent } from './post-create.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, defer, delay, of } from 'rxjs';
import { LikeService } from '../../../../services/like/like.service';
import { PostService } from '../../../../services/post/post.service';
import { StorageService } from '../../../../services/util/storage.service';
import { PermissionService } from '../../../../services/post/permission.service';
import { generateCategories, generatePermissions } from '../../../../models/post/permission.mock';
import { generateOnePost } from '../../../../models/post/post.mock';

fdescribe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let postSvSpy: jasmine.SpyObj<PostService>;
  let permSvSpy: jasmine.SpyObj<PermissionService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  const permissions = generatePermissions();
  const categories = generateCategories();
  const post = generateOnePost(1);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCreateComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {provide: PostService, useValue: jasmine.createSpyObj('postSV', ['getPost', 'createPost', 'updatePost']) },
        {provide: PermissionService, useValue: jasmine.createSpyObj('permissionSV', ['getCategories', 'getPermissions']) },
        {provide: ToastrService, useValue: jasmine.createSpyObj('toastrSV', ['success']) },
        // {
        //   provide: ActivatedRoute, 
        //   useValue: jasmine.createSpyObj(
        //     'ActivatedRoute', 
        //     [], 
        //     {params: new Observable(suscriber => suscriber.next({id: 1}))})
        // }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostCreateComponent);
      postSvSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
      permSvSpy = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
      toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
      
      postSvSpy.getPost.and.returnValue(of(post));
      permSvSpy.getCategories.and.returnValue(of(categories));
      permSvSpy.getPermissions.and.returnValue(of(permissions));
      
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set categories and permissions on init', fakeAsync(() => {
    permSvSpy.getCategories.and.returnValue(defer(() => of(categories)).pipe(delay(0)));
    permSvSpy.getPermissions.and.returnValue(defer(() => of(permissions)).pipe(delay(0)));
    component.ngOnInit();
    expect(component.loading()).toBeTrue();
    tick();
    expect(component.categories()).toEqual(categories);
    expect(component.permissions()).toEqual(permissions);
    expect(component.loading()).toBeFalse();
  }));

  // it('should change names of the categories on init', () => {

  // });
  
  // it('should load default permissions if post to update is not provided on init', () => {

  // });

  // it('should set post and load form with permissions if post to update is provided on init', () => {

  // });

  // it('should set loading to false on error getting permissions', () => {

  // });

  // it('should set loading to false on error getting categories', () => {

  // });

  // it('should set loading to false on error getting post', () => {

  // });

  // it('should have valid form if all controls are valid', () => {

  // });

  // it('should have an invalid form if title control are invalid', () => {

  // });

  // it('should have an invalid form if content control are invalid', () => {

  // });

  // it('should call service to create a post if post is not provided', () => {

  // });

  // it('should call service to update a post if post is provided', () => {

  // });

  // it('should show loading spinner if loading is true', () => {

  // });

  // it('should show form if loading is false', () => {

  // });

  // it('should show disable submit and cancel buttons if form is invalid', () => {

  // });

});
