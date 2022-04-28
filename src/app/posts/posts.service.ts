import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, map } from "rxjs";

import { Post } from "./post.model";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable()
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

	constructor(private http: HttpClient, private router: Router) {

	}

	getPosts(postsPerPage: number, currentPage: number) {
		const queryParameter = `?pagesize=${postsPerPage}&page=${currentPage}`;
		this.http
			.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParameter)
			.pipe(map((res) => {
				return { 
					posts: res.posts.map((post: any) => {
						return {
							title: post.title,
							content: post.content,
							id: post._id, 
							imagePath: post.imagePath,
							creator: post.creator
						}
					}), 
					maxPosts: res.maxPosts
				}
			}))
			.subscribe((transformedPostsData) => {
				this.posts = transformedPostsData.posts;
				this.postsUpdated.next({
					posts: [...this.posts], 
					postCount: transformedPostsData.maxPosts
				});
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
			.post<{message: string, post: Post}>(BACKEND_URL, postData)
			.subscribe(() => {
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
				imagePath: image,
				creator: null
			}
		}
		this.http.put(BACKEND_URL + id, postData)
			.subscribe(() => {
				this.router.navigate(["/"]);
			});
	}

	getPost(id: string) {
		return this.http.get<{ 
			_id: string, 
			title: string, 
			content: string, 
			imagePath: string,
			creator: string
		}>(BACKEND_URL + id);
	}

	deletePost(postId: string) {
		return this.http.delete(BACKEND_URL + postId);
	}
}