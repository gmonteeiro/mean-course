import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, map } from "rxjs";

import { Post } from "./post.model";

@Injectable()
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private http: HttpClient, private router: Router) {

	}

	getPosts() {
		this.http
			.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
			.pipe(map((res) => {
				return res.posts.map((post: any) => {
					return {
						title: post.title,
						content: post.content,
						id: post._id, 
						imagePath: post.imagePath
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

	addPost(title: string, content: string, image: File) {
		const postData = new FormData();
		postData.append('title', title);
		postData.append('content', content);
		postData.append('image', image, title);
		this.http
			.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
			.subscribe(res => {
				const post:Post = {
					id: res.post.id, 
					title: title, 
					content: content,
					imagePath: res.post.imagePath
				}
				this.posts.push(post);
				this.postsUpdated.next([...this.posts]);
				this.router.navigate(["/"]);
			});
	}

	updatePost(id: string, title: string, content: string, image: File | string) {
		let postData: Post | FormData;
		if (typeof image === "object") {
			postData = new FormData();
			postData.append('id', id);
			postData.append('title', title);
			postData.append('content', content);
			postData.append('image', image, title);
		} else {
			postData = {
				id: id, 
				title: title, 
				content: content,
				imagePath: image
			}
		}
		this.http.put('http://localhost:3000/api/posts/' + id, postData)
			.subscribe(response => {
				console.log(response);
				const updatedPosts = [...this.posts];
				const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
				const post: Post = {
					id: id, 
					title: title, 
					content: content,
					imagePath: null
				}
				updatedPosts[oldPostIndex] = post;
				this.posts = updatedPosts;
				this.postsUpdated.next([...this.posts]);
				this.router.navigate(["/"]);
			});
	}

	getPost(id: string) {
		return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
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