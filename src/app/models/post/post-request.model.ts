import { Post } from "./post.model";

export interface PostRequest {
    title:       string;
    content:     string;
    permissions: PermissionRequest[];
}

export interface PermissionRequest {
    category_id:   number;
    permission_id: number;
}


export interface PostResponse extends Pick<Post, 'id' | 'title' | 'content'> {
    author:  number;
}

