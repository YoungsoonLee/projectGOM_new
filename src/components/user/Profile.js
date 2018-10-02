import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import { Container, Form, Dimmer, Loader, Label, Button, Message } from 'semantic-ui-react'

@withRouter
@inject("store")
@observer
class Profile extends Component {

    state = { confirmPassword: '' };

    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
    }

    componentDidMount() {
        const { history } = this.props;
        this.store.getProfile(history);
    }

    /*
    componentDidUpdate() {
        //sthis.store.getProfile();
    }
    */

    handleInputPassword = (e, { value }) => {
        this.store.userInfo.password = value;
    }

    handleInputConfirmPassword = (e, {value}) => {
        this.setState({ confirmPassword: value });
    }

    handleUpdateProfile(e) {
        e.preventDefault();
        const { history } = this.props;
        this.store.updateProfile(history);
    }

    handleUpdatePassword(e) {
        e.preventDefault();
        const { history } = this.props;
        this.store.updatePassword(this.state.confirmPassword,history);
    }

    handleEmail= (e, { value }) => {
        this.store.profileEmail = value;
    }

    handleDisplayname = (e, {value}) => {
        this.store.profileDisplayname = value;
    }

    render() {
        const { history } = this.props;
        const { error, errorFlash, successFlash, profileEmail, profileDisplayname, loggedInUserInfo, userInfo, loading } = this.store;

        const ErrorView = (
            <Label basic color='red' size='small' style={{border:0}}>{error}</Label>
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
                <div className="page posts">
                    <h3>Profile</h3> <p>If you want to change, Input new value and click the change button.</p>
                    <Form className='attached fluid segment' style={{ maxWidth: 450 }}>
                        <Form.Input color={'Grey'} label='Display Name' type='text' value={profileDisplayname === null ? '': profileDisplayname} onChange={this.handleDisplayname} />
                        <Form.Input label='Email' type='text' value={profileEmail === null ? '': profileEmail} onChange={this.handleEmail}/>
                        <Button color='blue' onClick={this.handleUpdateProfile.bind(this)}>Change</Button>
                    </Form>
                    <hr />
                    <h3>Change Password</h3>
                    { errorFlashView }
                    { successFlashView }
                    <Form className='attached fluid segment' style={{ maxWidth: 450 }}>
                        <Form.Input label='New Password' name='password' placeholder='new password' type='password' value={userInfo.password} onChange={this.handleInputPassword}/>
                        <Form.Input label='Confirm Password' name='confirmPassword' placeholder='confirm password' type='password' value={this.state.confirmPassword} onChange={this.handleInputConfirmPassword}/>
                        <div>
                            { error !== null ? ErrorView : null }
                        </div>
                        <Button color='blue' onClick={this.handleUpdatePassword.bind(this)}>Submit</Button>
                    </Form>
                </div>
            </Container>
        );
    }
}


export default Profile;