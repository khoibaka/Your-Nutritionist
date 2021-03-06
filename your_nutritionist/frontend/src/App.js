import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import "./AppGrid.scss";
import { Route, Switch, Redirect } from "react-router-dom";
import NewRecipeContainer from "./Containers/Recipe/NewRecipe/NewRecipeContainer";
import HeaderContainer from "./Containers/Util/Header/HeaderContainer";
import RecipeShowContainer from "./Containers/Recipe/RecipeShow/RecipeShowContainer";
import UserShowContaner from "./Containers/User/UserShow/UserShowContainer";
import DarkModeToggleContainer from "./Containers/Util/DarkModeToggle/DarkModeToggleContainer";
import SearchPage from "./Pages/Search/SearchPage";
import DevPage from "./Pages/Dev/DevPage";
import Homepage from "./Pages/Homepage/Homepage";
import queryString from "query-string";
import EditRecipeContainer from "./Containers/Recipe/EditRecipe/EditRecipeContainer";
import DarkMode from "./Containers/Util/DarkMode/DarkMode";
import { Row, Col } from "react-bootstrap";
import SideBarContainer from "./Containers/SideBar/SideBarContainer";
import RightBarContainer from "./Containers/RightBar/RightBarContainer";

function App(props) {
	return (
		<div className="App">
			<DarkMode />
			<HeaderContainer />
			<div className="spa-wrapper">
				<div className="one-third">
					<SideBarContainer />
				</div>
				<div className="two-thirds">
					<Switch>
						<Route path="/recipe/create" component={NewRecipeContainer} />
						<Route
							path="/recipe/:recipe_id/edit"
							render={(props) => (
								<EditRecipeContainer
									key={props.match.params["user_id"]}
									{...props}
								/>
							)}
						/>
						<Route path="/recipe/:recipe_id" component={RecipeShowContainer} />
						<Route
							path="/user/:user_id"
							render={(props) => (
								<UserShowContaner key={props.match.params["user_id"]} {...props} />
							)}
						/>
						<Route
							path="/search"
							render={(props) => (
								<SearchPage
									key={queryString.parse(props.location.search).query}
									{...props}
								/>
							)}
						/>
						<Route path="/dev" component={DevPage} />
						<Route path="/homepage" component={Homepage} />
						<Route path="/">
							<Redirect to="homepage" />
						</Route>
					</Switch>
				</div>
				<div className="three-thirds">
					<RightBarContainer />
				</div>
			</div>
		</div>
	);
}

export default App;
