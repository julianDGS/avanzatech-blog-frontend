import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private postSV: PostService,
    private permissionSV: PermissionService,
    private fb: FormBuilder
  ){
    this.buildForm()
  }

  ngOnInit(): void {
    this.permissionSV.getCategories().pipe(
      switchMap(resp => {
        this.categories.set(resp.sort((a, b) => b.id - a.id))
        this.loadCategories()
        return this.permissionSV.getPermissions()
      })
    ).subscribe(resp => {
      this.permissions.set(resp)
    })
  }

  private loadCategories(){
    for (let category of this.categories()){
      this.addPermission(category.id)
    }
  }

  onSubmit(){
    if(!this.postForm.pristine){
      const request: PostRequest = this.postForm.value 
      console.log(this.postForm.value);
      console.log(request);
    }
  }

  buildForm(){
    this.postForm = this.fb.group({
      title: [null, []],
      content: [null, []],
      // author: [null, []],
      // team: [null, []],
      // authenticate: [null, []],
      // public: [null, []],
      permissions: this.fb.array([])
    })
  }

  get permissionsForm(){
    return this.postForm.get('permissions') as FormArray
  }

  private addPermission(categoryId: number, permissionId?: number){
    this.permissionsForm.push(
      this.fb.group({
        category_id: [ {value: categoryId, disabled: true} , []],
        permission_id: [ permissionId ? permissionId : null , []]
      })
    )
  }

}
