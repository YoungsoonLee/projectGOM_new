import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";

import { observer, inject } from 'mobx-react';

@withRouter
@inject("store")
@observer
export default class Social extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
    }

    handleFacebook(e) {
        e.preventDefault();
        this.store.setLoading('on');
        const {history, lastLocation} = this.props;
		this.store.socialAuth('facebook',history, lastLocation);
    }

    handleGoogle(e) {
        e.preventDefault();
        this.store.setLoading('on');
        const {history, lastLocation} = this.props;
		this.store.socialAuth('google',history, lastLocation);
    }

    render() {
        const { history, lastLocation } = this.props;
        
        return (
            <div>
                <Button size='small' color='facebook' onClick={this.handleFacebook.bind(this)}>
                    <Icon name='facebook' /> Facebook
                </Button>
                <Button size='small' color='google plus' onClick={this.handleGoogle.bind(this)}>
                    <Icon name='google plus' /> Google Plus
                </Button>
            </div>
        );
    }
}
