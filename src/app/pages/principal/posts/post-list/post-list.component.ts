import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';

import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';


import { PaginatedPost } from '../../../../models/post/post.model';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    MatCardModule, 
    MatChipsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatPaginatorModule,
    PaginatorComponent
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  
  paginatedObject = signal<PaginatedPost | null>(null)
  itemsPerPage = 10;

  constructor(
    private postSV: PostService
  ){}

  ngOnInit(): void {
    this.listPosts();
  }

  private listPosts(page='1'){
    this.postSV.listPosts(page).subscribe((resp) => {
      console.log(resp)
      this.paginatedObject.set(resp);
    })
  }

  changePage(page: number){
    const pageStr = String(page)
    this.listPosts(pageStr);
  }

}
