import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import { Container, Label, Button, Message, Form, Header, Icon, Grid, Input, Segment } from 'semantic-ui-react'

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
        const { history } = this.props;
        e.preventDefault();
        console.log("click handleResetPassword");
        this.store.setLoading('on');
        this.store.resetPassword(
            this.props.match.params.token,
            this.state.confirmPassword,
            history
        )
    }
    
    render() {
        const { errorFlash, successFlash, userInfo } = this.store;

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

        return (
            <Container text style={{ marginTop: '5em' }}>
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
                                <Button color='violet' 
                                        onClick={
                                            ()=>this.store.resetPassword(
                                                this.props.match.params.token,
                                                this.state.confirmPassword,
                                                history
                                            )
                                        }>Save</Button>
                            </Form.Field>
                        </Form>

                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}


export default ResetPassword;