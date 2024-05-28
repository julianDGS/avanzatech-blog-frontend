import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';

import {MatCardModule} from '@angular/material/card';

import { PaginatedPost, Post } from '../../../../models/post/post.model';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';
import { StorageService } from '../../../../services/util/storage.service';
import { PostComponent } from '../../../../components/post/post.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    MatCardModule,
    PostComponent,
    PaginatorComponent
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  
  paginatedObject = signal<PaginatedPost | null>(null)
  itemsPerPage = 10;
  isLogged = signal(false);

  constructor(
    private postSV: PostService,
    private toastrSV: ToastrService,
    private storageSV: StorageService
  ){}

  ngOnInit(): void {
    this.listPosts();
    this.loadUser();
  }

  private async loadUser(){
    const resp = await this.storageSV.get('logged-user')
      if(resp && resp !== null){
        this.isLogged.set(true)
      }
  }

  private listPosts(page='1'){
    this.postSV.listPosts(page).subscribe((resp) => {
      this.paginatedObject.set(resp);
    })
  }

  changePage(page: number){
    const pageStr = String(page)
    this.listPosts(pageStr);
  }

  deletePost(event: Post){
    if(event){
      this.postSV.deletePost(event.id).subscribe(() => {
        this.toastrSV.success(`${event.title} deleted succesfully`, 'Success', {
          progressBar: true
        })
        this.listPosts()
      })
    }
  }

}
