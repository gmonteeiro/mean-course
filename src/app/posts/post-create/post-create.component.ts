import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Post } from "../post.model";

@Component({
  	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: ['./post-create.component.scss']
})

export class PostCreateComponent {
	@Output() postCreated = new EventEmitter<Post>();

	onAddPost(form: NgForm) {
		if (form.invalid) {
			return;
		}
		const post: Post = { 
			title: form.value.enteredTitle, 
			content: form.value.enteredContent 
	  };
		this.postCreated.emit(post);
	}
}