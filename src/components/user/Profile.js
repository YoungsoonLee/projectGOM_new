import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import { Container, Form, Dimmer, Loader, Label, Button, Message, Icon } from 'semantic-ui-react'

@withRouter
@inject("store")
@observer
class Profile extends Component {

    state = { confirmPassword: '', curPassword: '' };

    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
        this.store.setLoading('on');
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

    handleInputCurPassword = (e, {value}) => {
        this.setState({ curPassword: value });
    }

    handleUpdateProfile(e) {
        e.preventDefault();
        const { history } = this.props;
        this.store.setLoading('on');
        this.store.updateProfile(history);
    }

    handleUpdatePassword(e) {
        e.preventDefault();
        const { history } = this.props;
        this.store.setLoading('on');
        this.store.updatePassword(this.store.userInfo.password, this.state.confirmPassword,history);
    }

    handleEmail= (e, { value }) => {
        this.store.profileEmail = value;
    }

    handleDisplayname = (e, {value}) => {
        this.store.profileDisplayname = value;
    }

    render() {
        //const { history } = this.props;
        const { error, errorFlash, successFlash, profileEmail, profileDisplayname, profileProvider, userInfo, loading } = this.store;

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
        
        var emailView = null;
        if (profileProvider != "") {
            emailView = (
                <div>
                    <p>* Your account is connected to social account. So you cannot change email.</p>
                    <Label size="big" color={'olive'}>
                        <Icon name='mail' /> {profileEmail === null ? '': profileEmail}
                    </Label>
                </div>
            )
        }else{
            emailView = (
                <Form.Input label='Email' type='text' value={profileEmail === null ? '': profileEmail} onChange={this.handleEmail}/>
            )
        }

        /*
        var curPasswordView = null;
        if (profileProvider != "") {
            curPasswordView = (
                <div>
                    <p>* Your account is connected to social account. You can set password and then use when login with displayname.</p>
                    <br/>
                </div>
            )
        }else{
            curPasswordView = (
                <Form.Input label='Current Password' name='password' placeholder='current password' type='password' value={this.state.curPassword} onChange={this.handleInputCurPassword}/>
            )
        }
        */

		const loaderView = (
            <Dimmer active inverted>
                <Loader size='small'></Loader>
            </Dimmer>
        )

        return (
            <Container text style={{ marginTop: '5em' }}>
                <div>
					{ errorFlashView }
					{ successFlashView }
				</div>
                <div className="page posts">
                    <h3>Profile</h3> <p>If you want to change, Input new value and click the change button.</p>
                    <Form className='attached fluid segment' style={{ maxWidth: 600 }}>
                        <Form.Input color={'Grey'} label='Display Name' type='text' value={profileDisplayname === null ? '': profileDisplayname} onChange={this.handleDisplayname} />
                        {emailView}
                        <br/>
                        { loading === 'on' ? loaderView : null  }
                        <Button color='blue' onClick={this.handleUpdateProfile.bind(this)}>Change</Button>
                    </Form>
                    <hr />
                    <h3>Change Password</h3>
                    <Form className='attached fluid segment' style={{ maxWidth: 600 }}>
                        <Form.Input label='New Password' name='password' placeholder='new password' type='password' value={userInfo.password} onChange={this.handleInputPassword}/>
                        <Form.Input label='Confirm Password' name='confirmPassword' placeholder='confirm password' type='password' value={this.state.confirmPassword} onChange={this.handleInputConfirmPassword}/>
                        <div>
                            { error !== null ? ErrorView : null }
                        </div>
                        <br/>
                        { loading === 'on' ? loaderView : null  }
                        <Button color='blue' onClick={this.handleUpdatePassword.bind(this)}>Submit</Button>
                    </Form>
                </div>
            </Container>
        );
    }
}


export default Profile;