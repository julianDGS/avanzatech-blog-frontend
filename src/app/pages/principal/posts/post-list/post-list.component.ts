import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';

import {MatCardModule} from '@angular/material/card';

import { PaginatedPost, Post } from '../../../../models/post/post.model';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';
import { StorageService } from '../../../../services/util/storage.service';
import { PostComponent } from '../../../../components/post/post.component';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';


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
  isLogged = signal(false);
  itemsPerPage = 10;
  private user?: {id: number, teamId: number};

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
        this.user = {
          id: resp.id,
          teamId: resp.teamId
        }
      }
  }

  private listPosts(page='1'){
    this.postSV.listPosts(page)
    .pipe(
      tap(resp => this.canEdit(resp.results))
    )
    .subscribe((resp) => {
      this.paginatedObject.set(resp);
    })
  }

  private canEdit(posts: Post[]){
    if(this.isLogged()){
      for (let post of posts) {
        if (post.author.id === this.user?.id && post.permissions.author === "edit"){
          post.can_edit = true
        } else if (post.author.team?.id === this.user?.teamId && post.permissions.team === "edit") {
          post.can_edit = true
        } else if (post.permissions.auth === "edit") {
          post.can_edit = true
        } else {
          post.can_edit = false
        }
      }
    }
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
