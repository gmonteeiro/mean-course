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

	constructor( public postsService: PostsService ) {

	}

	ngOnInit(): void {
		this.posts = this.postsService.getPosts();
		this.postsSubscription = this.postsService.getPostUpdateListener()
		.subscribe((posts: Post[]) => {
			this.posts = posts;
		});
	}

	ngOnDestroy(): void {
		if (this.postsSubscription) {
			this.postsSubscription.unsubscribe();
		}
	}
}