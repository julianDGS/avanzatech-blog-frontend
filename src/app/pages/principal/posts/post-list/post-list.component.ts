import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';

import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Posts } from '../../../../models/post/post.model';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  
  page = signal(0);
  posts = signal<Posts[]>([])

  constructor(
    private postSV: PostService
  ){}

  ngOnInit(): void {
    let page = '';
    if(this.page() !== 0){
      page = String(this.page());
    }
    this.postSV.listPosts(page).subscribe((resp) => {
      this.posts.set(resp.results);
    })
  }

}
