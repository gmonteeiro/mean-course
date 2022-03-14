import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from '../post.model';
import { PostsService } from "../posts.service";

interface IPosts {
	title: string;
	content: string;
}

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
	posts:Post[] = [];
	postsSubscription!: Subscription;
	isLoading = false;

	constructor( public postsService: PostsService ) {

	}

	ngOnInit(): void {
		this.isLoading = true;
		this.postsService.getPosts();
		this.postsSubscription = this.postsService.getPostUpdateListener()
		.subscribe((posts: Post[]) => {
			this.isLoading = false;
			this.posts = posts;
		});
	}

	onDelete(postId: string) {
		this.postsService.deletePost(postId);
	}

	ngOnDestroy(): void {
		if (this.postsSubscription) {
			this.postsSubscription.unsubscribe();
		}
	}
}