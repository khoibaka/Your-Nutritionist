import React, { Component } from "react";
import SideBar from "../../Components/Util/SideBar/SideBar";
import { withRouter } from "react-router-dom";
import TrendingCard from "../../Components/Home/TrendingCard/TrendingCard";
import PostCreateContainer from "../../Containers/NewFeed/PostCreate/PostCreateContainer";
import * as actions from "../../store/actions/index";
import "./SideBarContainer.scss";
import { connect } from "react-redux";
import ModalContainer from "../Util/Authentication/ModalContainer";
import axios from "../../axios-orders";
class SideBarContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			trendingRecipes: [],
		};
		this.showCreatePostModal = this.showCreatePostModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.resetCreatePostInput = this.resetCreatePostInput.bind(this);
		this.toCreateRecipe = this.toCreateRecipe.bind(this);
		this.toTrendingRecipe = this.toTrendingRecipe.bind(this);
		this.addMedia = this.addMedia.bind(this);
		this.deleteMedia = this.deleteMedia.bind(this);
		this.showSigninModal = this.showSigninModal.bind(this);
		this.showRegisterModal = this.showRegisterModal.bind(this);
		this.fetchTrendingRecipes = this.fetchTrendingRecipes.bind(this);
		this.toTrendingCreator = this.toTrendingCreator.bind(this);
	}

	// Authentication

	componentDidMount() {
		this.fetchTrendingRecipes();
		if (this.props.token) this.props.retrieveUserFromToken(this.props.token);
	}

	getTokenFromLocalStorage = () => {
		return localStorage.getItem("TOKEN");
	};

	showSigninModal = (event) => {
		event.preventDefault();
		this.props.showSigninModal();
	};

	showRegisterModal = (event) => {
		event.preventDefault();
		this.props.showRegisterModal();
	};

	toCreateRecipe = (event) => {
		event.preventDefault();
		event.stopPropagation();
		this.props.history.push("/recipe/create");
	};

	changeNewPostFormType = (event) => {
		event.preventDefault();
		this.resetCreatePostInput();
		this.setState({
			modal: -this.state.modal,
		});
	};

	resetCreatePostInput = () => {
		this.setState({
			url: "",
			file: null,
			file_title: "",
			content: "",
		});
	};

	hideModal = () => {
		this.setState({
			modal: false,
		});
	};

	showCreatePostModal = () => {
		this.setState({
			modal: true,
		});
	};

	toTrendingCreator = (event, creator_id) => {
		// console.log(event + " " + creator_id);
		event.preventDefault();
		event.stopPropagation();
		// console.log(creator_id);
		this.props.history.push("/user/" + creator_id);
	};

	toTrendingRecipe = (recipe_id) => {
		this.props.history.push("/recipe/" + recipe_id);
	};

	// Media
	addMedia = () => {
		let tmp = this.state.medias;
		tmp.push({
			type: 0,
			name: "",
			url: "",
			fileId: -1,
			label: "Choose an image",
		});
		this.setState({ medias: tmp });
	};

	deleteMedia = (index) => {
		let medias = this.state.medias;
		let files = this.state.files;
		if (medias[index].fileId !== -1) {
			files = this.removeElementAtIndex(files, medias[index].fileId);
		}
		medias = this.removeElementAtIndex(medias, index);
		this.setState({ medias: medias, files: files }, () => {
			console.log(this.state);
		});
	};

	fetchTrendingRecipes = () => {
		axios.get("api/recipe/trending", {params:{num: 5}}).then((response) => {
			this.setState({ trendingRecipes: response.data.recipes });
		});
	};

	// add_images_to_form_data(data, images) {
	//     for (var image_index = 0; image_index < images.length; image_index++) {
	//         data.append('image_' + image_index, images[image_index])
	//     }
	//     return data
	// }

	render() {
		let fakeTrendingRecipes = [
			{
				recipe_id: 1,
				creator_id: 3,
				creator_name: "Hoang Anh",
				recipe_name: "gà rán kfc",
				recipe_favorites: 69,
				recipe_ratings: 5,
				recipe_creation_date: "2020年07月24日",
			},
			{
				recipe_id: 2,
				creator_id: 2,
				creator_name: "Hoang Anh",
				recipe_name: "really gà rán kfc",
				recipe_favorites: 420,
				recipe_ratings: 4,
				recipe_creation_date: "2020年07月24日",
			},
			{
				recipe_id: 3,
				creator_id: 1,
				creator_name: "Hoang Anh",
				recipe_name: "not gà rán kfc",
				recipe_favorites: 247,
				recipe_ratings: 3,
				recipe_creation_date: "2020年07月24日",
			},
			{
				recipe_id: 4,
				creator_id: 1,
				recipe_name: "is not gà rán kfc",
				recipe_favorites: 247,
				recipe_ratings: 3,
				recipe_creation_date: "2020年07月24日",
			},
			{
				recipe_id: 53,
				creator_id: 1,
				recipe_name: "xor gà rán kfc",
				recipe_favorites: 247,
				recipe_ratings: 3,
				recipe_creation_date: "2020年07月24日",
			},
		];
		return (
			<div className="sidebar-container">
				<PostCreateContainer
					modal={this.state.modal}
					hideModal={this.hideModal}
				></PostCreateContainer>
				<SideBar
					toCreateRecipe={
						this.props.token === null ? this.props.showSigninModal : this.toCreateRecipe
					}
					showCreatePostModal={
						this.props.token === null
							? this.props.showSigninModal
							: this.showCreatePostModal
					}
				/>
				<h3 id="trending-title">Trending</h3>
				{this.state.trendingRecipes.map((recipe, index) => {
					return (
						<TrendingCard
							rank={index + 1}
							recipe={recipe}
							toTrendingCreator={(event) => {
								this.toTrendingCreator(event, recipe.creator_id);
							}}
							toTrendingRecipe={() => {
								this.toTrendingRecipe(recipe.recipe_id);
							}}
						/>
					);
				})}
				<ModalContainer></ModalContainer>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		showSigninModal: () => dispatch(actions.showSigninModal()),
		showRegisterModal: () => dispatch(actions.showRegisterModal()),
		retrieveUserFromToken: (token) => dispatch(actions.retrieveUserFromToken(token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SideBarContainer));
