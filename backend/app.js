const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods", 
		"GET, POST, PATCH, DELETE, OPTIONS"
	);
	next();
});

app.post("/api/posts", (req, res, next) => {
	const post = req.body
	console.log(post);
	res.status(201).json({
		message: "Post added successfully!"
	});
});

app.get('/api/posts', (req, res, next) => {
	const posts = [
		{
			id: 'a0s9d8ad09as', 
			title: 'First post', 
			content: 'this is coming from server'
		},
		{
			id: '0hg9dgfg9s', 
			title: 'Second post', 
			content: 'this is coming from server'
		},
		{
			id: '1df2g45g9', 
			title: 'Third post', 
			content: 'this is coming from server'
		}
	];

	res.status(200).json({
		message: "Posts fetched successfully",
		posts: posts
	});
});

module.exports = app;