import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

import { Container, Dimmer, Button, Message, Form, Header, Loader, Grid, Input, Segment } from 'semantic-ui-react'

@inject("store")
@observer
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
    }
    
    /*
    componentDidMount() {
        //this.store.setInitUserInfo();
    }
    */

    handleInputEmail = (e, { value }) => {
        this.store.userInfo.email = value;
    }

    // for flash
	handleDismiss = (e, {name}) => {
        if (name == "errorFlash") {
            this.store.errorFlash = null;
        }else{
            this.store.successFlash = null;
        }
    }
    
    handleForgotPassword(e) {
        console.log("click handleForgotPassword");
        this.store.setLoading('on');

        this.store.forgotPassword();
    }

    render() {
        const { errorFlash, successFlash, userInfo, loading } = this.store;

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
                            Forgot Password
                        </Header>
                        <Header.Subheader>
                            It will send a password reset token to you.
                        </Header.Subheader>
                        <Header.Subheader>
                            Input your email and click send.
                        </Header.Subheader>

                        <Form>
                            <Form.Field></Form.Field>
                            <Form.Field>
                                <Input style={{ maxWidth: 300 }}
                                    icon='mail' 
                                    iconPosition='left'
                                    placeholder='E-mail address' 
                                    name='email' 
                                    size='small'
                                    value={userInfo.email} 
                                    onChange={this.handleInputEmail}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Button color='violet' onClick={this.handleForgotPassword.bind(this)}>Send</Button>
                            </Form.Field>
                        </Form>

                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default ForgotPassword;