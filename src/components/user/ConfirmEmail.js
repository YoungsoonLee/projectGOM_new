import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import { Dimmer, Loader, Segment, Container } from 'semantic-ui-react'

@withRouter
@inject("store")
@observer
class ConfirmEmail extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.appState;
    }

    componentDidMount() {
        const { history } = this.props;
        console.log(this.props.match.params.token, history);
        this.store.confirmEmail(this.props.match.params.token, history);
    }

    render() {
        return (
            <Container text style={{ marginTop: '5em' }}>
                <Loader active inline='centered' />
            </Container>
        );
    }
}

export default ConfirmEmail;