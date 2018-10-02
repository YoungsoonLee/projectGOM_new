import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect, withRouter } from "react-router-dom";
import { withLastLocation } from 'react-router-last-location';

import { Container, Button, Header, Dimmer, Message, Grid, Form, Segment, Input, Divider, Label, Loader } from 'semantic-ui-react'

import Social from './Social';

@withRouter
@inject("store")
@observer
export default class Signup extends Component {
	constructor(props) {
        super(props);
		this.store = this.props.store.appState;
		console.log(this.store.loading);
    }

    /*
    componentDidMount() {
        console.log('Signup componentDidMount');
    }
    
    componentDidUpdate(){
        console.log('Signup componentDidUpdate');
    }
    */

    handleInputEmail = (e, { value }) => {
        this.store.userInfo.email = value;
    }

    handleInputPassword = (e, { value }) => {
        this.store.userInfo.password = value;
    }

    handleInputDisplayName = (e, { value }) => {
        this.store.userInfo.displayname = value;
	}
	
	handelSignup(e){
		e.preventDefault();
		{/* add the rest of the function here */}
        console.log("click");
        this.store.setLoading('on');

        const {history, lastLocation} = this.props;
        //console.log(this.store.loading);
        this.store.Signup(history, lastLocation);
    }

    handleGotoSignin(e) {
        e.preventDefault();
        const {history} = this.props;
        history.push('/login');
    }

	render() {
        const { userInfo, error, loading } = this.store;
        
        const ErrorView = (
            <Message error visible size='tiny'>{error}</Message>
        );

        const loaderView = (
            <Dimmer active inverted>
                <Loader size='huge'></Loader>
            </Dimmer>
        )

		return (
            <Container text style={{ marginTop: '5em' }} >
                { loading === 'on' ? loaderView : null  }
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' >
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' textAlign='center'>SIGN UP</Header>
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
                                        icon='mail' 
                                        iconPosition='left'
                                        placeholder='E-mail address' 
                                        name='email' 
                                        value={userInfo.email} 
                                        onChange={this.handleInputEmail}
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
                                </Form.Field>
								<div>
									<Button color='violet' fluid size='small' onClick={this.handelSignup.bind(this)}>SIGN UP</Button>
								</div>
								<Divider horizontal>Or</Divider>
								<Social />
							</Segment>
                        </Form>
                        <Message>
                            Already join us?  <a style={{ cursor: 'pointer', color: 'blue' }} onClick={this.handleGotoSignin.bind(this)}>Login</a>
                        </Message>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}
