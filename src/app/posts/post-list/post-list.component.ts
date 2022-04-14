import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

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
	isLoading = false;
	totalPosts = 0;
	postsPerPage = 2;
	currentPage = 1;
	pageSizeOptions = [1, 2, 5, 10];
	userIsAuthenticated = false;

	private authStatusSub!: Subscription;
	private postsSubscription!: Subscription;

	constructor( public postsService: PostsService, public authService: AuthService ) {

	}

	ngOnInit(): void {
		this.isLoading = true;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
		this.postsSubscription = this.postsService
			.getPostUpdateListener()
			.subscribe((postData: { posts: Post[], postCount: number}) => {	
				this.isLoading = false;
				this.totalPosts = postData.postCount;
				this.posts = postData.posts;
			});
		
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.authStatusSub = this.authService
			.getAuthStatusListener()
			.subscribe(isAuthenticated => {
				this.userIsAuthenticated = isAuthenticated;
			});
	}

	onDelete(postId: string) {
		this.postsService.deletePost(postId).subscribe(() => {
			this.postsService.getPosts(this.postsPerPage, this.currentPage);
		});
	}

	onChangePage(pageData: PageEvent){
		this.isLoading = true;
		this.currentPage = pageData?.pageIndex + 1;	
		this.postsPerPage = pageData.pageSize;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
	}

	ngOnDestroy(): void {
		this.postsSubscription.unsubscribe();
		this.authStatusSub.unsubscribe();
	}
}