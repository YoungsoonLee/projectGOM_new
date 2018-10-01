import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Message } from 'semantic-ui-react'

@inject("store")
@observer
export default class Home extends Component {

	constructor(props) {
		console.log("home constructor")
		super(props);
		this.store = this.props.store;
		this.store.appState.setLoading('off');
		this.store.appState.checkAuth();
	}

    componentDidMount() {
        console.log('home componentDidMount');
    }
     
    componentDidUpdate(){
        console.log('home componentDidUpdate');
	}
	
	// for flash
	handleDismiss = () => {
		this.store.appState.successFlash = null;
	}

	render() {
		const { errorFlash, successFlash } = this.store.appState;

		var successFlashView = null;
		if (successFlash) {
			successFlashView = (
                <Message success onDismiss={this.handleDismiss} content={successFlash}/>
			);
		}
        var errorFlashView = null;
        if(errorFlash) {
            errorFlashView = (
                <Message error onDismiss={this.handleDismiss} content={errorFlash} />
            );
		}
		
		return (
			<div className="page home">
				<header>
					<div>
						{ errorFlashView }
						{ successFlashView }
					</div>
					<div className="hero-unit">
						<div className="react-logo" />
						<h1>Closers! naddic games</h1>
					</div>
				</header>
				
				<main>
					<div className="section-header">
						<h3>Included libraries</h3>
						<hr />
					</div>
					<div className="boilerplate-item">
						<div className="boilerplate-logo react" />
						<div className="boilerplate-item-content">
							<a
								href="https://facebook.github.io/react/"
								target="_blank"
							>
								<h4>React</h4>
							</a>
							<small>UI Library</small>
							<p>
								React makes it painless to create
								{" "}
								<br />
								interactive UIs.
							</p>
						</div>
					</div>
					<div className="boilerplate-item">
						<div className="boilerplate-logo mobx" />
						<div className="boilerplate-item-content">
							<a
								href="http://mobxjs.github.io/mobx/"
								target="_blank"
							>
								<h4>MobX</h4>
							</a>
							<small>Reactive State Management</small>
							<p>
								MobX is a battle tested library that makes state management simple and scalable.
							</p>
						</div>
					</div>
					<div className="boilerplate-item">
						<div className="boilerplate-logo reactrouter" />
						<div className="boilerplate-item-content">
							<a
								href="https://react-router.now.sh/"
								target="_blank"
							>
								<h4>React Router 4</h4>
							</a>
							<small>Routing Library</small>
							<p>
								React Router is a declarative way to render, at any location, any UI that you and your team can think up.
							</p>
						</div>
					</div>
					<div className="boilerplate-item">
						<div className="boilerplate-logo webpack" />
						<div className="boilerplate-item-content">
							<a href="http://webpack.github.io/" target="_blank">
								<h4>Webpack 2</h4>
							</a>
							<small>Module Bundler</small>
							<p>
								Webpack takes modules with dependencies and generates static assets representing those modules.
							</p>
						</div>
					</div>
					<div className="section-header extras">
						<h4>Extras</h4>
						<hr />
						<ul>
							<li>✓ Async Component Loading</li>
							<li>✓ Code-splitting</li>
							<li>✓ Extracted and autoprefixed CSS</li>
						</ul>
					</div>
				</main>
			</div>
		);
	}
}
