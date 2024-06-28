import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { PostCreateComponent } from './post-create.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../../services/post/post.service';
import { PermissionService } from '../../../../services/post/permission.service';
import { categoryCopy, generateCategories, generatePermissions, permissionCopy } from '../../../../models/post/permission.mock';
import { generateOnePost } from '../../../../models/post/post.mock';
import { defer, delay, of, throwError } from 'rxjs';
import { findAllComponents, findComponent } from '../../../../util/find-component';


describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let postSvSpy: jasmine.SpyObj<PostService>;
  let permSvSpy: jasmine.SpyObj<PermissionService>;
  let toastrSvSpy: jasmine.SpyObj<ToastrService>;
  let activateRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;
  const permissions = generatePermissions();
  const categories = generateCategories();
  const post = generateOnePost(1);
  const formValue = {
    title: 'title',
    content_html: '<p>content</p>',
    permissions: [
      {category_id: 1, permission_id: 2},
      {category_id: 2, permission_id: 2},
      {category_id: 3, permission_id: 1},
      {category_id: 4, permission_id: 1},
    ]
  }

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
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    activateRouteSpy.params = of({});
    postSvSpy.getPost.and.returnValue(of({...post}));
    permSvSpy.getCategories.and.returnValue(of(categoryCopy(categories)));
    permSvSpy.getPermissions.and.returnValue(of(permissionCopy(permissions)));
    
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set categories and permissions on init', fakeAsync(() => {
    permSvSpy.getCategories.and.returnValue(defer(() => of(categoryCopy(categories))).pipe(delay(0)));
    permSvSpy.getPermissions.and.returnValue(defer(() => of(permissionCopy(permissions))).pipe(delay(0)));
    fixture.detectChanges();
    expect(component.loading()).toBeTrue();
    tick();
    expect(component.categories().length).toEqual(4);
    expect(component.categories()).toContain({id: 1, name: 'Owner'});
    expect(component.permissions().length).toEqual(3);
    expect(component.permissions()).toContain({id: 1, name: 'read only'});
    expect(component.loading()).toBeFalse();
  }));

  it('should change names of the permissions on init', fakeAsync(() => {
    component.permissions.set(permissionCopy(permissions));
    permSvSpy.getPermissions.and.returnValue(defer(() => of(permissionCopy(permissions))).pipe(delay(0)));
    fixture.detectChanges();
    expect(component.permissions()).toEqual(permissions);
    tick();
    expect(component.permissions()).not.toEqual(permissions);
  }));
  
  it('should load default permissions if post to update is not provided on init', () => {
    fixture.detectChanges();
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

  it('should set loading to false on error getting permissions', () => {
    permSvSpy.getPermissions.and.returnValue(throwError(() => 'error'));
    fixture.detectChanges();
    expect(component.loading()).toBeFalse();
  });

  it('should set loading to false on error getting categories', () => {
    permSvSpy.getCategories.and.returnValue(throwError(() => 'error'));
    fixture.detectChanges();
    expect(component.loading()).toBeFalse();
  });

  it('should have a valid form if all controls are valid', () => {
    fixture.detectChanges();
    component.postForm.setValue({...formValue});
    expect(component.postForm.valid).toBeTrue();
  });

  it('should have an invalid form if title control are invalid', () => {
    fixture.detectChanges();
    const value = {...formValue, title: null};
    component.postForm.setValue(value);
    expect(component.postForm.valid).toBeFalse();
  });

  it('should have an invalid form if content control are invalid', () => {
    fixture.detectChanges();
    const value = {...formValue, content_html: null};
    component.postForm.setValue(value);
    expect(component.postForm.valid).toBeFalse();
  });

  it('should call service to create a post', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    flush();
    component.editorElement = {
      quillEditor: jasmine.createSpyObj({getText: 'content'})
    };
    const mockRequest = {...formValue, content: 'content'};
    spyOn(router, 'navigate');
    spyOn(component.formDir, 'resetForm').and.callThrough();
    postSvSpy.createPost.and.returnValue(defer(() => 
      of({id: 2, title: mockRequest.title, content: mockRequest.content, author: 1})
    ).pipe(delay(0)));
    component.postForm.setValue({...formValue});
    component.postForm.markAsDirty();
    component.onSubmit();
    expect(component.postForm.disabled).toBeTrue();
    expect(postSvSpy.createPost).toHaveBeenCalledOnceWith(mockRequest);
    tick();
    expect(component.postForm.disabled).toBeFalse();
    expect(toastrSvSpy.success).toHaveBeenCalledWith(`${mockRequest.title}, created successfully`, 'Success', {progressBar: true});
    expect(component.formDir.resetForm).toHaveBeenCalledTimes(1);
    expect(component.postForm.value).toEqual({
      title: null,
      content_html: null,
      permissions: [{permission_id: null},{permission_id: null},{permission_id: null},{permission_id: null}]
    });
    expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
  }));

  it('should navigate to home on cancel', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate');
    spyOn(component.formDir, 'resetForm');
    component.onCancel();
    expect(component.formDir.resetForm).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
  });

  it('should show loading spinner if loading is true', () => {
    const spinner = findComponent(fixture, 'mat-spinner');
    expect(spinner).toBeDefined();
  });

  it('should show form if loading is false', () => {
    fixture.detectChanges();
    const spinner = findComponent(fixture, 'mat-spinner');
    const form = findComponent(fixture, 'form');
    expect(spinner).toBeNull();
    expect(form).toBeDefined();
  });

  it('should show disable submit and cancel buttons if form is invalid', () => {
    fixture.detectChanges();
    const buttons = findAllComponents(fixture, 'button');
    expect(buttons[0].attributes['ng-reflect-disabled']).toEqual('true');
    expect(buttons[1].attributes['ng-reflect-disabled']).toEqual('true');
  });

  describe('when post to update is provided', () => {

    beforeEach(() => {
      activateRouteSpy.params = of({id: 1});
      fixture.detectChanges();
    })

    it('should set loading to false on error getting post', () => {
      component.loading.set(true);
      component.post.set(null);
      postSvSpy.getPost.and.returnValue(throwError(() => 'error'));
      component.ngOnInit();
      expect(component.loading()).toBeFalse();
    });

    it('should set post on init', () => {
      expect(postSvSpy.getPost).toHaveBeenCalledOnceWith(1);
      expect(component.post()).toEqual(post);
    });
  
    it('should load form with permissions on init', () => {
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

    
    it('should call service to update that post', fakeAsync(() => {
      component.editorElement = {
        quillEditor: jasmine.createSpyObj({getText: 'content'})
      };
      const mockRequest = {...formValue, content: 'content'};
      spyOn(router, 'navigate');
      spyOn(component.formDir, 'resetForm').and.callThrough();
      postSvSpy.updatePost.and.returnValue(defer(() => 
        of({id: 2, title: mockRequest.title, content: mockRequest.content, author: 1})
      ).pipe(delay(0)));
      component.postForm.setValue({...formValue});
      component.postForm.markAsDirty();
      component.onSubmit();
      expect(component.postForm.disabled).toBeTrue();
      expect(postSvSpy.updatePost).toHaveBeenCalledOnceWith(post.id, mockRequest);
      tick();
      expect(component.postForm.disabled).toBeFalse();
      expect(toastrSvSpy.success).toHaveBeenCalledWith(`${mockRequest.title}, updated successfully`, 'Success', {progressBar: true});
      expect(component.formDir.resetForm).toHaveBeenCalledTimes(1);
      expect(component.postForm.value).toEqual({
        title: null,
        content_html: null,
        permissions: [{permission_id: null},{permission_id: null},{permission_id: null},{permission_id: null}]
      });
      expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
    }));

    it('should do nothing if form is pristine on submit', () => {
      fixture.detectChanges();
      component.postForm.setValue({...formValue});
      component.onSubmit();
      expect(postSvSpy.updatePost).not.toHaveBeenCalled();
    });
  })
  
});
