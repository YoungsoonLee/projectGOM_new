import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import TopNav from "./TopNav";
import Button from "./ui/Button";

import { Menu, Container, Dropdown, Icon, Image,Header } from 'semantic-ui-react';

@withRouter
@inject("store")
@observer
export default class TopBar extends Component {

	state = { activeItem: 'home' };

	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
		console.log("top bar constructor");
	}

	/*
	handleLogin(e) {
		const { authenticated } = this.store;

		if (e) e.preventDefault();
		console.log("CLICKED BUTTON");
		
		if (authenticated) {
			//logout
		}else{
			//login
			this.props.history.push('/login');
		}

		//this.store.authenticate();
	}

	handleSignup(e) {
		const { authenticated } = this.store;

		if (e) e.preventDefault();
		console.log("CLICKED BUTTON");
		
		if (authenticated) {
			//logout
		}else{
			//login
			this.props.history.push('/signup');
		}

		//this.store.authenticate();
	}
	*/

	handleItemClick = (e, { name }) => { 
		e.preventDefault();

		this.store.setInitUserInfo();

		this.setState({ activeItem: name });

		if (name === 'home') {
			this.props.history.push('/');
		}else{
			this.props.history.push('/'+name);
		}
	};

	handleLogout() {
		console.log("logout")

		const {history} = this.props;
		this.store.logout(history, "");
	}

	render() {
		const { authenticated, loggedInUserInfo } = this.store;

		var Viewpane = null;
		const { activeItem } = this.state;

		
		if(authenticated) {
			Viewpane = (
				<Menu.Menu position='right'>
					<Menu.Item >
						<Image src={loggedInUserInfo.gravatar} size='mini' circular />
						<Dropdown item text={loggedInUserInfo.displayname} size='mini' >
							<Dropdown.Menu>
								<Dropdown.Item name='profile' onClick={this.handleItemClick.bind(this)}>My Profile</Dropdown.Item>
								<Dropdown.Item name='payment/history' onClick={this.handleItemClick.bind(this)}>My Coin</Dropdown.Item>
								<Dropdown.Item onClick={this.handleLogout.bind(this)}>Sign Out</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Item>
				</Menu.Menu>
			)
		}else{
			Viewpane = (
				<Menu.Menu position='right'>
					<Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
					<Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.handleItemClick} />
				</Menu.Menu>
			)
		}

		var paymentPane = null;
		if(authenticated) {
			paymentPane = (
				<Menu.Item name='payment' active={activeItem === 'payment'} onClick={this.handleItemClick} >
					<Icon name='diamond'/>{numeral(this.store.loggedInUserInfo.balance).format('0,0')}
				</Menu.Item>
			)
		}
		
		return (
			<div>
				<Menu size='tiny' pointing borderless={true} fixed='top'>
					<Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
					<Menu.Item name='news' active={activeItem === 'news'} onClick={this.handleItemClick} />
					<Menu.Item name='forum' active={activeItem === 'forum'} onClick={this.handleItemClick} />

					{paymentPane}
					
					{Viewpane}
				</Menu>
			</div>
		);
	}
}
