import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import { Container, Dimmer, Button, Message, Form, Header, Loader, Grid, Input, Segment } from 'semantic-ui-react'

@withRouter
@inject("store")
@observer
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
    }

    state = { confirmPassword: '' };

    componentDidMount() {
        const { history } = this.props;
        
        //this.store.setInitUserInfo();
        this.store.setLoading('on');
        
        this.store.isValidResetPasswordToken(this.props.match.params.token, history);
    }

    handleInputPassword = (e, { value }) => {
        this.store.userInfo.password = value;
    }

    handleInputConfirmPassword = (e, {value}) => {
        this.setState({ confirmPassword: value });
    }

    // for flash
	handleDismiss = (e, {name}) => {
        if (name == "errorFlash") {
            this.store.errorFlash = null;
        }else{
            this.store.successFlash = null;
        }
    }

    handleResetPassword(e) {
        e.preventDefault();
        //console.log("click handleResetPassword");

        this.store.setLoading('on');

        const {history} = this.props;
        var confirmPassword = this.state.confirmPassword;
        this.setState({ confirmPassword: "" });

        this.store.resetPassword(
            this.props.match.params.token,
            confirmPassword,
            history
        )
    }
    
    render() {
        const { error, errorFlash, successFlash, userInfo, loading } = this.store;

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
            <Container text style={{ marginTop: '5em' }}>
                { loading === 'on' ? loaderView : null  }
                <Grid>
                    <Grid.Column>
                        <div>
                            { errorFlashView }
                            { successFlashView }
                        </div>
                        <Header as='h2' icon dividing>
                            Reset Password
                        </Header>
                        <Header.Subheader>
                            Input new password
                        </Header.Subheader>

                        <Form>
                            <Form.Field></Form.Field>
                            <Form.Field>
                                <Input style={{ maxWidth: 300 }}
                                    icon='lock' 
                                    iconPosition='left'
                                    placeholder='Password' 
                                    type='password' 
                                    name='password' 
                                    size='small'
                                    value={userInfo.password} 
                                    onChange={this.handleInputPassword}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input style={{ maxWidth: 300 }}
                                    icon='lock' 
                                    iconPosition='left'
                                    placeholder='Confirm Password' 
                                    type='password' 
                                    name='confirmPassword' 
                                    size='small'
                                    value={this.state.confirmPassword} 
                                    onChange={this.handleInputConfirmPassword}
                                />
                            </Form.Field>
                            <Form.Field>
                                <div>
                                    { error !== null ? ErrorView : null }
                                </div>
                                <div></div>
                            </Form.Field>
                            <Form.Field>
                                <Button color='violet' 
                                        onClick={this.handleResetPassword.bind(this)}>Save</Button>
                            </Form.Field>
                        </Form>

                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}


export default ResetPassword;