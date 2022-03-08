import { Subject } from "rxjs";

import { Post } from "./post.model";

export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	getPosts() {
		return [...this.posts];
	}

	getPostUpdateListener():any {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string) {
		const post: Post = { title: title, content: content };
		this.posts.push(post);
		this.postsUpdated.next([...this.posts]);
	}
}