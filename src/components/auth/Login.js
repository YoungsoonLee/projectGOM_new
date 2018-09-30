import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

import { Container, Button, Dimmer, Loader, Message, Grid, Form, Segment, Input, Divider, Label, Icon } from 'semantic-ui-react'

import Social from './Social';

@inject("store")
@observer
export default class Login extends Component {
	constructor(props) {
        super(props);
		this.store = this.props.store.appState;
		console.log("login constructor");
	}
	
	componentDidMount() {
        console.log('login componentDidMount');
    }
    
    componentDidUpdate(){
        console.log('login componentDidUpdate');
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
		console.log("click")
		this.store.setLoading('on');
		const {history, lastLocation} = this.props;
		this.store.Login(history, lastLocation);
	  }

	render() {
		const { userInfo, error, loading } = this.store;
        
        const ErrorView = (
            <Label color={'red'} size='small' style={{border:0}}>{error}</Label>
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
                                </Form.Field>
								<div>
									<Button color='violet' fluid size='small' onClick={this.handelLogin.bind(this)}>SIGN UP</Button>
								</div>
								<Divider horizontal>Or</Divider>
								<Social />
							</Segment>
						</Form>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}
