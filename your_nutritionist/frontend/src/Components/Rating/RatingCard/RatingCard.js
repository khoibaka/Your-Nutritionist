import React from 'react';
import './RatingCard.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button, FormFile } from 'react-bootstrap';
import StarRating from '../../StarRating/StarRating';
const RatingCard = (props) => {
	console.log(props);
	return (
		<div className="rating-wrapper">
			<div className="card rating-card">
				<Row>
					<Col md="auto" className="comment-profile-wrapper">
						<div className="comment-profile" style={{ backgroundImage: "url('" + props.rating.profilepic + "')" }} />
					</Col>

					<Col xs="auto" md={7} className="comment-content">
						<br />
						<Link to={'/user/' + props.rating.user_id}>{props.rating.name}</Link> said on <br />
						{props.rating.comment}
					</Col>
					<Col className="comment-rating">
						<StarRating rating={props.rating.rating} />
					</Col>
					{/* <div className="see-more-trigger">
                    <span id="">See more bitches</p>
                </div> */}
					{props.rating.comment.length > 400 ? (
						<div className="see-more-trigger">
							<span id="see-more-active">See more</span>
						</div>
					) : null}
				</Row>
			</div>
		</div>
	);
};

export default RatingCard;