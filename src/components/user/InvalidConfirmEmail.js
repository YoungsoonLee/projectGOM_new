import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

import { Container, Label, Button, Message, Form, Header, Grid, Input } from 'semantic-ui-react'

@inject("store")
@observer
class InvalidConfirmEmail extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
    }

    handleInputEmail = (e, { value }) => {
        this.store.setClearMessage();
        this.store.userInfo.email = value;
    }

    handleResendConfirmEmail(e) {
        e.preventDefault();
        console.log("click handleResendConfirmEmail");
        this.store.setLoading('on');
        this.store.resendConfirmEmail();
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
                            Unconfirmed email.
                        </Header>
                        <Header.Subheader>
                            Your account need to confirm email.
                        </Header.Subheader>
                        <Header.Subheader>
                            If you want to resend, input your email and click resend.
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
                                <Button color='violet' onClick={this.handleResendConfirmEmail.bind(this)}>Resend</Button>
                            </Form.Field>
                        </Form>

                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}


export default InvalidConfirmEmail;