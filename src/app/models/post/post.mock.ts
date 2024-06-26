import { faker } from "@faker-js/faker"
import { Post, PaginatedPost } from "./post.model";
import { generateOneUser } from "../user/user.mock";
import { PostRequest, PostResponse } from "./post-request.model";
import { generatePostPermissions } from "./permission.mock";

export const generatePaginatedPost = (): PaginatedPost => {
    return {
      next:         faker.internet.url(),
      previous:     faker.internet.url(),
      total_count:  10,
      current_page: 1,
      total_pages:  2,
      results:      generateManyPosts()
    };
  }

  export const generateOnePost = (id: number): Post => {
    const obj = {
      id:           id,
      createdAt:    faker.date.anytime(),
      title:        faker.word.words(3),
      content:      faker.word.words(5),
      content_html: faker.word.words(55),
      excerpt:      '',
      author:       generateOneUser(),
      permissions:  generatePostPermissions(),
      likes:        5,
      comments:     2,
      post_liked:   true,
    }
    obj.author.id = id;
    obj.excerpt = obj.content_html.substring(200);
    return obj;
  }

  export const generateManyPosts = (): Post[] => {
    const posts: Post[] = [];
    for (let i = 0; i < 10; i++) {
      posts.push(generateOnePost(i+1));
    }
    return posts;
  }

  export const generatePostRequest = (post: Post): PostRequest => {
    return {
      title: post.title,
      content: post.content,
      content_html: post.content_html,
      permissions: [
        {category_id: 1, permission_id: post.permissions.author.id},
        {category_id: 2, permission_id: post.permissions.team.id},
        {category_id: 3, permission_id: post.permissions.auth.id},
        {category_id: 4, permission_id: post.permissions.public.id}
      ]
    }
  }

  export const generatePostResponse = (post: Post): PostResponse => {
    const obj = {
      id:           post.id,
      title:        post.title,
      content:      post.content,
      author:       post.author.id,
    }
    return obj;
  }