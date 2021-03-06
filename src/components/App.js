import React, { Component } from "react";
import { Route, Link, withRouter, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";
import LazyRoute from "lazy-route";
import DevTools from "mobx-react-devtools";

import { LastLocationProvider } from 'react-router-last-location';

// Components
import TopBar from "./TopBar";
import NotFound from "./NotFound";
import Home from "./Home";
import { Login, Logout, Signup } from './auth/index';
import {ConfirmEmail, InvalidConfirmEmail, ForgotPassword, ResetPassword, Profile } from './user/index';
import { Payment } from './billing/index';

@withRouter
@inject("store")
@observer
export default class App extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store;
	}
	componentDidMount() {
		//this.authenticate();
	}
	authenticate(e) {
		if (e) e.preventDefault();
		//this.store.appState.authenticate();
		this.store.appState.checkAuth();
	}
	render() {
		const {
			authenticated,
			authenticating,
			timeToRefresh,
			refreshToken,
			testval
		} = this.store.appState;
		return (
			<div>
				{/*<DevTools />*/}
				<TopBar />
				<LastLocationProvider>
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/login" component={Login}/>
						<Route path="/signup" component={Signup}/>
						<Route path="/confirmEmail/:token" component={ConfirmEmail} />
						<Route path="/invalidConfirmEmail" component={InvalidConfirmEmail} />
						<Route path="/forgotPassword" component={ForgotPassword} />
						<Route path="/resetPassword/:token" component={ResetPassword} />
						<Route path="/profile" component={Profile} />

						<Route exact path="/payment" component={Payment} />

						<Route component={NotFound}/> 
					</Switch>
				</LastLocationProvider>
				<footer>
						{testval}
						<a href="https://twitter.com/naddicgames" target="_blank">
							@naddic games
						</a>
						{" "}
						| officail korean website:
						{" "}
						<a href="http://closers.nexon.com" target="_blank">
							nexon closers
						</a>
					</footer>
				{/*
				<Route
					exact
					path="/"
					render={props => (
						<LazyRoute {...props} component={import("./Home")} />
					)}
				/>
				<Route
					exact
					path="/posts"
					render={props => (
						<LazyRoute {...props} component={import("./SubPage")} />
					)}
				/>
				<Route
					exact
					path="/posts/:id"
					render={props => (
						<LazyRoute {...props} component={import("./SubItem")} />
					)}
				/>
				<Route
					exact
					path="/login"
					render={props => (
						<LazyRoute {...props} component={import("./auth/Login")} />
					)}
				/>
				<Route
					exact
					path="/signup"
					render={props => (
						<LazyRoute {...props} component={import("./auth/Signup")} />
					)}
				/>
				<footer>
					{testval}
					<a href="https://twitter.com/mhaagens" target="_blank">
						@mhaagens
					</a>
					{" "}
					| github:
					{" "}
					<a href="https://github.com/mhaagens" target="_blank">
						mhaagens
					</a>
				</footer>
					*/}
			</div>
		);
	}
}
