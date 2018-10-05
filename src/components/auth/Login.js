import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

import { Container, Button, Dimmer, Loader, Header, Grid, Form, Segment, Input, Divider, Message, Icon } from 'semantic-ui-react'

import Social from './Social';

@inject("store")
@observer
export default class Login extends Component {
	constructor(props) {
        super(props);
		this.store = this.props.store.appState;
		console.log("login constructor");

		//this.store.checkAuth();
		this.store.setInitUserInfo();
	}
	
	/*
	componentDidMount() {
		console.log('login componentDidMount');
    }
    */
   
    componentDidUpdate(){
		//console.log('login componentDidUpdate');
		//console.log(this.store.authenticated);
		
		if (this.store.authenticated === true) {
			const {history} = this.props;
			this.store.setSuccessFlashMessage('You already logged in.');
			history.push('/');
		}
    }
	
    handleInputPassword = (e, { value }) => {
        this.store.userInfo.password = value;
    }

    handleInputDisplayName = (e, { value }) => {
        this.store.userInfo.displayname = value;
	}
	
	handelLogin(e){
		e.preventDefault();
		{/* add the rest of the function here */}
		//console.log("click")
		this.store.setLoading('on');
		const {history, lastLocation} = this.props;
		this.store.Login(history, lastLocation);
	}

	handleGotoSignup(e) {
		e.preventDefault();
		const {history} = this.props;
		history.push('/signup');
	}

	handleForgotPassword(e){
		e.preventDefault();
		const {history} = this.props;
		history.push('/forgotPassword');
	}

	// for flash
	handleDismiss = (e, {name}) => {
        if (name == "errorFlash") {
            this.store.errorFlash = null;
        }else{
            this.store.successFlash = null;
        }
	}

	render() {
		const { userInfo, error, loading, errorFlash, successFlash } = this.store;
        
        const ErrorView = (
            <Message error visible size='tiny'>{error}</Message>
		);

		var successFlashView = null;
		if (successFlash) {
			successFlashView = (
                <Message success name="successFlash" onDismiss={this.handleDismiss} content={successFlash}/>
			);
		}
        var errorFlashView = null;
        if(errorFlash) {
            errorFlashView = (
                <Message error name="errorFlash" onDismiss={this.handleDismiss} content={errorFlash} />
            );
		}
		
		const loaderView = (
            <Dimmer active inverted>
                <Loader size='huge'></Loader>
            </Dimmer>
        )

		return (
			<Container text style={{ marginTop: '5em' }} >
				{ loading === 'on' ? loaderView : null  }
				<div>
					{ errorFlashView }
					{ successFlashView }
				</div>
				<Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' >
					
					<Grid.Column style={{ maxWidth: 450 }}>
					<Header as='h2' textAlign='center'>SIGN IN</Header>
						<Form size='large'>
							<Segment>
								<Form.Field>
									<Input 
										icon='user' 
										iconPosition='left' 
										placeholder='Display name.(Nick name)' 
										name='displayname'
										value={userInfo.displayname} 
                            			onChange={this.handleInputDisplayName}
									/>
								</Form.Field>
								<Form.Field>
									<Input 
										icon='lock' 
										iconPosition='left' 
										placeholder='Password' 
										type='password' 
										name='Password'
										value={userInfo.password} 
                            			onChange={this.handleInputPassword}
									/>
								</Form.Field>
								<Form.Field>
                                    <div>
                                        { error !== null ? ErrorView : null }
									</div>
									<div></div>
                                </Form.Field>
								<div>
									<Button color='violet' fluid size='small' onClick={this.handelLogin.bind(this)}>SIGN IN</Button>
								</div>
								<Divider horizontal>Or</Divider>
								<Social />
							</Segment>
						</Form>
						<Message>
							<a style={{ cursor: 'pointer', color: 'blue' }} onClick={this.handleForgotPassword.bind(this)}>Forgot Password?</a> | New to us?  <a style={{ cursor: 'pointer', color: 'blue' }} onClick={this.handleGotoSignup.bind(this)}>Sign up</a>
                        </Message>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}
