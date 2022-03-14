import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, map } from "rxjs";

import { Post } from "./post.model";

@Injectable()
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private http: HttpClient) {

	}

	getPosts() {
		this.http
			.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
			.pipe(map((res) => {
				return res.posts.map((post: any) => {
					return {
						title: post.title,
						content: post.content,
						id: post._id
					}
				})
			}))
			.subscribe((mappedPosts) => {
				this.posts = mappedPosts;
				this.postsUpdated.next([...this.posts]);
			});
	}

	getPostUpdateListener():any {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string) {
		const post: Post = { id: '', title: title, content: content };
		this.http
			.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
			.subscribe(res => {
				post.id = res.postId;
				this.posts.push(post);
				this.postsUpdated.next([...this.posts]);
			});
	}

	updatePost(id: string, title: string, content: string) {
		const post: Post = { id: id, title: title, content: content }
		this.http.put('http://localhost:3000/api/posts/' + id, post)
			.subscribe(response => {
				console.log(response);
				const updatedPosts = [...this.posts];
				const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
				updatedPosts[oldPostIndex] = post;
				this.posts = updatedPosts;
				this.postsUpdated.next([...this.posts]);
			});
	}

	getPost(id: string) {
		return this.http.get<{ _id: string, title: string, content: string }>(
			'http://localhost:3000/api/posts/' + id
		);
	}

	deletePost(postId: string) {
		this.http
			.delete('http://localhost:3000/api/posts/' + postId)
		  .subscribe(() => {
				const updatedPosts = this.posts.filter(post => post.id !== postId);
				this.posts = updatedPosts;
				this.postsUpdated.next([...this.posts]);
			});
	}
}