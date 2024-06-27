import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { PostCreateComponent } from './post-create.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../../services/post/post.service';
import { PermissionService } from '../../../../services/post/permission.service';
import { generateCategories, generatePermissions, permissionCopy } from '../../../../models/post/permission.mock';
import { generateOnePost } from '../../../../models/post/post.mock';
import { defer, delay, of, throwError } from 'rxjs';

fdescribe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let postSvSpy: jasmine.SpyObj<PostService>;
  let permSvSpy: jasmine.SpyObj<PermissionService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  let activateRouteSpy: jasmine.SpyObj<ActivatedRoute>;
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
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostCreateComponent);
    postSvSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    permSvSpy = TestBed.inject(PermissionService) as jasmine.SpyObj<PermissionService>;
    toastrSvSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    activateRouteSpy= TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    
    postSvSpy.getPost.and.returnValue(of({...post}));
    permSvSpy.getCategories.and.returnValue(of(categories));
    permSvSpy.getPermissions.and.returnValue(of(permissionCopy(permissions)));
    activateRouteSpy.params = of();
    
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

  it('should change names of the permissions on init', fakeAsync(() => {
    component.permissions.set(permissionCopy(permissions));
    permSvSpy.getPermissions.and.returnValue(defer(() => of(permissionCopy(permissions))).pipe(delay(0)));
    component.ngOnInit();
    expect(component.permissions()).toEqual(permissions);
    tick();
    expect(component.permissions()).not.toEqual(permissions);
  }));
  
  it('should load default permissions if post to update is not provided on init', () => {
    const authorControl = component.permissionsForm.controls[0];
    const teamControl = component.permissionsForm.controls[1];
    const authControl = component.permissionsForm.controls[2];
    const publicControl = component.permissionsForm.controls[3];
    expect(authorControl.get('category_id')!.value).toEqual(1);
    expect(teamControl.get('category_id')!.value).toEqual(2);
    expect(authControl.get('category_id')!.value).toEqual(3);
    expect(publicControl.get('category_id')!.value).toEqual(4);
    expect(authorControl.get('permission_id')!.value).toEqual(2); //Edit permission id
    expect(teamControl.get('permission_id')!.value).toEqual(2);
    expect(authControl.get('permission_id')!.value).toEqual(1); // read permission id
    expect(publicControl.get('permission_id')!.value).toEqual(1);
  });

  it('should set post if post to update is provided on init', () => {
    activateRouteSpy.params = of({id: 1});
    component.ngOnInit();
    expect(postSvSpy.getPost).toHaveBeenCalledOnceWith(1);
    expect(component.post()).toEqual(post);
  });

  it('should load form with permissions if post to update is provided on init', () => {
    activateRouteSpy.params = of({id: 1});
    component.ngOnInit();
    const authorControl = component.permissionsForm.controls[0];
    const teamControl = component.permissionsForm.controls[1];
    const authControl = component.permissionsForm.controls[2];
    const publicControl = component.permissionsForm.controls[3];
    expect(authorControl.get('category_id')!.value).toEqual(1);
    expect(teamControl.get('category_id')!.value).toEqual(2);
    expect(authControl.get('category_id')!.value).toEqual(3);
    expect(publicControl.get('category_id')!.value).toEqual(4);
    expect(authorControl.get('permission_id')!.value).toEqual(post.permissions.author.id);
    expect(teamControl.get('permission_id')!.value).toEqual(post.permissions.team.id);
    expect(authControl.get('permission_id')!.value).toEqual(post.permissions.auth.id);
    expect(publicControl.get('permission_id')!.value).toEqual(post.permissions.public.id);
    expect(component.postForm.get('title')!.value).toEqual(post.title);
    expect(component.postForm.get('content_html')!.value).toEqual(post.content_html);
  });

  it('should set loading to false on error getting permissions', () => {
    permSvSpy.getPermissions.and.returnValue(throwError(() => 'error'));
    component.ngOnInit();
    expect(component.loading()).toBeFalse();
  });

  it('should set loading to false on error getting categories', () => {
    permSvSpy.getCategories.and.returnValue(throwError(() => 'error'));
    component.ngOnInit();
    expect(component.loading()).toBeFalse();
  });

  it('should set loading to false on error getting post', () => {
    activateRouteSpy.params = of({id: 1});
    postSvSpy.getPost.and.returnValue(throwError(() => 'error'));
    component.ngOnInit();
    expect(component.loading()).toBeFalse();
  });

  it('should have a valid form if all controls are valid', () => {

  });

  it('should have an invalid form if title control are invalid', () => {

  });

  it('should have an invalid form if content control are invalid', () => {

  });

  it('should call service to create a post if post is not provided', () => {

  });

  it('should call service to update a post if post is provided', () => {

  });

  it('should show loading spinner if loading is true', () => {

  });

  it('should show form if loading is false', () => {

  });

  it('should show disable submit and cancel buttons if form is invalid', () => {

  });

});
