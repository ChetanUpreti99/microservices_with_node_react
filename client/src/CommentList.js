import React from "react";
// import axios from "axios";

const CommentList = ({ comments }) => {
	// const [comments, setComments] = useState([]);

	/*const fetchData = async () => {
		const res = await axios.get(
			`http://localhost:4001/posts/${postId}/comments`
		);

		setComments(res.data);
	};

	useEffect(() => {
		fetchData();
	}, []);
	*/


	const renderedComments = comments.map((comment) => {
		let content = ``;
		if (comment.status === 'PENDING') {
			content = 'PENDING';
		} else if (comment.status === 'REJECTED') {
			content = 'REJECTED';
		} else {
			content = comment.content;
		}
		return <li key={comment.id}>{content}</li>;
	});

	return <ul>{renderedComments}</ul>;
};

export default CommentList;
