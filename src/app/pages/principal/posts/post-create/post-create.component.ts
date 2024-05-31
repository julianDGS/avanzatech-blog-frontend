import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionService } from '../../../../services/post/permission.service';
import { PermissionResponse } from '../../../../models/post/permission.model';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { PostRequest } from '../../../../models/post/post-request.model';
import { Router } from '@angular/router';

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

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  constructor(
    private postSV: PostService,
    private permissionSV: PermissionService,
    private fb: FormBuilder,
    private router: Router
  ){
    this.buildForm()
  }

  ngOnInit(): void {
    this.permissionSV.getCategories().pipe(
      switchMap(resp => {
        this.categories.set(resp) //.set(resp.sort((a, b) => b.id - a.id))
        return this.permissionSV.getPermissions()
      })
    ).subscribe(resp => {
      this.permissions.set(resp)
      const ids = this.changeNames();
      this.loadCategories(ids);
    })
  }

  private changeNames(){
    let read = 0;
    let edit = 0;
    for(let permission of this.permissions()){
      if(permission.name === 'read'){
        read = permission.id;
        permission.name = 'read only'
      } else if (permission.name === 'edit'){
        edit = permission.id;
        permission.name = 'read & write'
      }
    }
    return {read, edit}
  }

  private loadCategories(ids: {read: number, edit: number}){
    for (let category of this.categories()){
      let permId;
      switch(category.name){
        case 'author':
          permId = ids.edit;
          category.name = 'Owner'
          break;
        case 'team':
          permId = ids.edit;
          category.name = 'Team'
          break;
        case 'auth':
          permId = ids.read;
          category.name = 'Authenticated'
          break;
        case 'public':
          permId = ids.read;
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
      console.log(request);
      this.disableCategories()
    }
  }

  onCancel(){
    this.resetForm()
    this.router.navigate(['/'])
  }

  private resetForm(){
    this.formDir.resetForm();
    this.disableCategories();
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
