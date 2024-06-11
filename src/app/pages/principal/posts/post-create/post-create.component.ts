import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { delay, finalize, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { PostService } from '../../../../services/post/post.service';
import { PermissionService } from '../../../../services/post/permission.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionResponse, Permissions } from '../../../../models/post/permission.model';
import { Post } from '../../../../models/post/post.model';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { QuillEditorComponent, QuillModule } from 'ngx-quill'
import { PostRequest } from '../../../../models/post/post-request.model';


@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,

    QuillModule
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit{

  postForm!: FormGroup;
  permissions = signal<PermissionResponse[]>([]);
  categories = signal<PermissionResponse[]>([]); 
  post = signal<Post | null>(null);
  readId: number = 0;
  editId: number = 0;
  loading = signal(false);

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['code-block'],

      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      
      ['clean']   
    ]
  }

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;
  @ViewChild('editor') editorElement?: QuillEditorComponent;

  constructor(
    private postSV: PostService,
    private permissionSV: PermissionService,
    private toastrSV: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute
  ){
    this.buildForm()
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.permissionSV.getCategories().pipe(
      switchMap(resp => {
        this.categories.set(resp)
        return this.permissionSV.getPermissions()
      }),
    ).subscribe({
      next: resp => {
        this.permissions.set(resp)
        this.changeNames();
        this.loadPermissions();
      },
      error: () => this.loading.set(false)
    })
  }

  private loadPermissions(){
    this.activeRoute.params
    .pipe(
      switchMap(par => {
        if(par.hasOwnProperty('id')){
          return this.postSV.getPost(par['id'])
        }
        return of(null)
      }),
      delay(300),
    )
    .subscribe({ 
      next: post => {
        if(post !== null){
          this.post.set(post);
          this.loadPostPermissions(post.permissions);
          this.loadForm();
        } else {
          this.loadDefaultPermissions();
        }
        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  private loadPostPermissions(permissions: Permissions){
    for (let category of this.categories()){
      let permission = permissions[category.name as keyof Permissions]
      this.addPermission(category.id, permission.id)
    }
  }

  private changeNames(){
    for(let permission of this.permissions()){
      if(permission.name === 'read'){
        this.readId = permission.id;
        permission.name = 'read only'
      } else if (permission.name === 'edit'){
        this.editId = permission.id;
        permission.name = 'read & write'
      }
    }
  }

  private loadDefaultPermissions(){
    for (let category of this.categories()){
      let permId;
      switch(category.name){
        case 'author':
          permId = this.editId;
          category.name = 'Owner'
          break;
        case 'team':
          permId = this.editId;
          category.name = 'Team'
          break;
        case 'auth':
          permId = this.readId;
          category.name = 'Authenticated'
          break;
        case 'public':
          permId = this.readId;
          category.name = 'Public'
          break;
      }
      this.addPermission(category.id, permId)
    }
  }

  onSubmit(){    
    if(!this.postForm.pristine){
      this.postForm.enable()
      const request: PostRequest = this.postForm.value
      request.content = this.editorElement?.quillEditor.getText() || '';
      this.postForm.disable()
      let postObservable$;
      if(this.post() !== null){
        postObservable$ = this.postSV.updatePost(this.post()!.id, request);
      } else {
        postObservable$ = this.postSV.createPost(request);
      }
      postObservable$.pipe(
        finalize(() => {
          this.postForm.enable()
          this.disableCategories()
        })
      ).subscribe( resp => {
        this.toastrSV.success(`${resp.title}, ${this.post() !== null ? 'updated' : 'created'} successfully`, 'Success', {
          progressBar: true
        })
        this.resetForm();
      })
    }
  }

  onCancel(){
    this.resetForm()
  }

  private resetForm(){
    this.formDir.resetForm();
    this.router.navigate(['/'])
  }

  private disableCategories(){
    for (let i = 0; i < this.permissionsForm.controls.length; i++) {
      this.permissionsForm.controls[i].get('category_id')?.disable();
    }
  }

  private loadForm(){
    this.postForm.get('title')?.setValue(this.post()?.title);
    this.postForm.get('content_html')?.setValue(this.post()?.content_html);
  }

  private buildForm(){
    this.postForm = this.fb.group({
      title: [
        null,
        [Validators.required, Validators.maxLength(100)]
      ],
      content_html: [
        null,
        []
      ],
      permissions: this.fb.array([], {validators: [Validators.required, Validators.minLength(4)]})
    })
  }

  get permissionsForm(){
    return this.postForm.get('permissions') as FormArray
  }

  private addPermission(categoryId: number, permissionId?: number){
    this.permissionsForm.push(
      this.fb.group({
        category_id: [ {value: categoryId, disabled: true} , [Validators.required]],
        permission_id: [ permissionId ? permissionId : null , [Validators.required]]
      })
    )
  }

}
