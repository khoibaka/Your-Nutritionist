import React from 'react';
import './RatingCard.scss';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import StarRating from '../../../Util/StarRating/StarRating';
const RatingCard = (props) => {
	console.log(props);
	return (
		<div className="rating-wrapper">
			<div className={props.expand ? 'card rating-card' : 'card rating-card compressed'}>
				<Row>
					<Col md="auto" className="comment-profile-wrapper">
						<div className="comment-profile" style={{ backgroundImage: "url('" + props.rating.profilepic + "')" }} />
					</Col>

					<Col xs="auto" md={7} className={props.expand ? 'comment-content' : 'comment-content comment-compressed'}>
						<br />
						<Link to={'/user/' + props.rating.user_id}>{props.rating.name}</Link> said on {props.rating.rate_on} <br />
						{props.rating.comment}
					</Col>
					<Col className="comment-rating">
						<StarRating rating={props.rating.rating} />
					</Col>

					{/* <div className="see-more-trigger">
                    <span id="">See more bitches</p>
                </div> */}
					{props.rating.comment.length > 300 ? props.expand ? (
						<div className="see-less-trigger" onClick={props.expandRatingCardTrigger}>
							<span id="see-more-active" className="material-icons">
								keyboard_arrow_up
							</span>
						</div>
					) : (
						<div className="see-more-trigger" onClick={props.expandRatingCardTrigger}>
							<span id="see-more-active" className="material-icons">
								keyboard_arrow_down
							</span>
						</div>
					) : null}
				</Row>
			</div>
		</div>
	);
};

export default RatingCard;
