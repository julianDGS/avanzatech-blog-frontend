import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { Router } from '@angular/router';

import { PostService } from '../../../../services/post/post.service';
import { PermissionService } from '../../../../services/post/permission.service';
import { PostRequest } from '../../../../models/post/post-request.model';
import { PermissionResponse } from '../../../../models/post/permission.model';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';

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
    MatSelectModule
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit{

  postForm!: FormGroup;
  permissions = signal<PermissionResponse[]>([]);
  categories = signal<PermissionResponse[]>([]); 
  readId: number = 0;
  editId: number = 0;

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  constructor(
    private postSV: PostService,
    private permissionSV: PermissionService,
    private toastrSV: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ){
    this.buildForm()
  }

  ngOnInit(): void {
    this.permissionSV.getCategories().pipe(
      switchMap(resp => {
        this.categories.set(resp)
        return this.permissionSV.getPermissions()
      })
    ).subscribe(resp => {
      this.permissions.set(resp)
      this.changeNames();
      this.loadDefaultCategories();
    })
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

  private loadDefaultCategories(){
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
      this.postForm.disable()
      this.postSV.createPost(request).pipe(
        finalize(() => {
          this.postForm.enable()
          this.disableCategories()
        })
      ).subscribe( resp => {
        this.toastrSV.success(`${resp.title}, created successfully`, 'Success', {
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

  buildForm(){
    this.postForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      content: [null, [Validators.required, Validators.minLength(5)]],
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
