import { observable, action } from "mobx";
import axios from "axios";
import validator from 'validator';

import * as AuthAPI from '../lib/api/auth';
import * as UserAPI from '../lib/api/user';

import storage from '../lib/storage';
import redirect from '../lib/redirect';
import social from '../lib/social';
import hello from 'hellojs';

export default class AppState {
  @observable authenticated;
  @observable authenticating;
  @observable items;
  @observable item;
  @observable testval;

  //
  @observable displayname;
  @observable email;
  @observable password;
  @observable userInfo;
  @observable loggedInUserInfo;
  @observable error;
  @observable loading;
  @observable errorFlash;
  @observable successFlash;

  constructor() {
    this.authenticated = false;
    this.authenticating = false;
    this.items = [];
    this.item = {};
    this.testval = "Cobbled together by ";

    //
    this.displayname = '';
    this.email = '';
    this.password = '';
    this.error = null;
    this.loading = 'off';
    this.errorFlash = null;
    this.successFlash = null;

    //for signup and login
    this.userInfo = {
      displayname: '',
      email: '',
      password: ''
    }

    this.loggedInUserInfo = {
      //uid: '',
      displayname: '',
      gravatar: '',
      balance: '0',
      gravatar: '',
    }
  }

  @action setLoading(value) {
    this.loading = value;
  }

  @action setError(msg) {
    if (msg != null) {
      this.error = msg;
      this.setLoading('off');
    }else{
      this.error = msg;
    }
  }

  @action setInitUserInfo() {
    this.userInfo.displayname = '';
    this.userInfo.email = '';
    this.userInfo.password = '';

    this.setClearMessage();
  }

  @action setAuthenticated(auth, displayname, balance, gravater) {
    console.log("setAuth: ", displayname);
    this.authenticated = auth;
    this.loggedInUserInfo.displayname = displayname;
    this.loggedInUserInfo.balance = balance;
    this.loggedInUserInfo.gravatar = gravater;
  }

  @action  setInitLoggedInUserInfo() {
    storage.remove('___GOM___');

    this.authenticated = false;

    //this.loggedInUserInfo.uid = '';
    this.loggedInUserInfo.displayname = '';
    this.loggedInUserInfo.balance = '0';
    this.loggedInUserInfo.gravatar = '';

    this.setClearMessage();
  }

  @action setClearMessage() {
    this.error = null;
    this.errorFlash = null;
    this.successFlash = null;
  }

  @action setSuccessFlashMessage(msg) {
    this.successFlash = msg
  }

  @action setErrorFlashMessage(msg) {
    this.errorFlash = msg
  }

  // Signup
  async Signup(history, lastLocation) {
    
    if ( 
      !(validator.isLength(this.userInfo.displayname, {min:4, max: 16})) || 
      (validator.contains(this.userInfo.displayname, ' ')) || 
      !(validator.isAlphanumeric(this.userInfo.displayname))
      ){
      this.setError('A displayname has 4~16 letters/numbers without space.');
    }else if(!validator.isEmail(this.userInfo.email)) {
      this.setError('Please input a valid email address.');
    }else if ( !(validator.isLength(this.userInfo.password, {min:8, max: undefined})) || (validator.contains(this.userInfo.password, ' ')) ){
      this.setError('The password must be at least 8 characters long without space.');
    }else{
      this.setError(null);
    }

    if(!this.error) {
      //let data = null;
      let respData = null;
      try{
        // call backend
        respData = await AuthAPI.localRegister({...this.userInfo});

        // set init userinfo
        this.setInitUserInfo();

        // make cookie
        storage.set('___GOM___', respData.data.data);

        // login
        //await this.checkAuth();

        // redirect to home
        redirect.set(history,lastLocation);

        // flash message
        this.setSuccessFlashMessage('Welcome ! ' + respData.data.data.displayname);

      }catch(err){
        if (err.response.data) {
          this.setError(err.response.data.message);
        }else{
          this.setError(err);
        }

      }
    }
  }

  // localLogin
  // async localLogin(history, lastLocation) {
  async Login(history,lastLocation) {
    //console.log("call login");
    
    if ( 
      !(validator.isLength(this.userInfo.displayname, {min:4, max: 16})) || 
      (validator.contains(this.userInfo.displayname, ' ')) || 
      !(validator.isAlphanumeric(this.userInfo.displayname))
      ){
      this.setError('a displayname has 4~16 letters/numbers without space.');
    }else if ( !(validator.isLength(this.userInfo.password, {min:8, max: undefined})) || (validator.contains(this.userInfo.password, ' ')) ){
      this.setError('The password must be at least 8 characters long without space.');
    }else{
      this.setError(null);
    }

    if(!this.error) {
      
      //let data = null;
      let respData = null;
      try{

        respData = await AuthAPI.localLogin({displayname: this.userInfo.displayname, password: this.userInfo.password});
        
        this.setInitUserInfo();

        storage.set('___GOM___', respData.data.data);

        //await this.checkAuth();

        redirect.set(history,lastLocation);

        // flash message
        this.setSuccessFlashMessage('Welcome ! ' + this.userInfo.displayname);

      }catch(err){
        //console.log(err);
        if (err.response.data) {
          this.setError(err.response.data.message);
        }else{
          this.setError(err);
        }
      }
    }
    
  }

  async checkAuth() {
    //check auth
    //TODO: think ! check GOM or not
    let cookieInfo = null;
    cookieInfo = storage.get('___GOM___');

    if ( cookieInfo ) {
      let auth = null;
      try{
        auth = await AuthAPI.checkLoginStatus(cookieInfo.token);
      }catch(e){
        await this.setInitLoggedInUserInfo();
      }

      if(!auth) {
        await this.setInitLoggedInUserInfo()
      }else{
        await this.setAuthenticated(
          true,
          auth.data.data.Displayname, 
          auth.data.data.Balance.toString(), 
          auth.data.data.Pciture
        );
      }
    }else{
      console.log('no gom');
      await this.setInitLoggedInUserInfo();
    }
  }


  // socialAuth
  async socialAuth(provider, history, lastLocation) {

    social[provider]().then((auth)=>{
      //console.log(auth)

      hello(auth.network).api('/me').then(function(r) {   

        AuthAPI.socialAuth({ 
          provider: provider, 
          accessToken: auth.authResponse.access_token,
          email: r.email,
          providerId: r.id,
          picture: r.picture
        }).then((response)=>{
          //console.log(response.data.data);

          storage.set('___GOM___', response.data.data);

          redirect.set(history,lastLocation);

          //this.checkAuth();

          // flash message
          this.setSuccessFlashMessage('Welcome ! ' + respData.data.data.displayname);
  
        }).catch((err)=>{
          console.log("err ", err);

          if (err.response.data) {
            this.setError(err.response.data.message);
          }else{
            this.setError(err);
          }
        });

      }, function(e) {
        this.setError('somthing wrong with '+provider+'. try again after a few minutes. '+e.message);
      });

    }).catch((err)=>{
        this.setError('somthing wrong with '+provider+'. try again after a few minutes.');
    });
  }


  async confirmEmail(confirm_token, history) {
    let data = null;
    try{ 
      data = await UserAPI.confirmEmail(confirm_token);
    }catch(err){
      this.errorFlash = err.response.data.message;
    }

    //console.log(data);

    if(!data) {
      //this.errorFlash = 'token is invalid or has expired. try resend again.';
      this.setErrorFlashMessage('token is invalid or has expired. try resend again.');
      history.push('/invalidConfirmEmail');
    }else{
      //this.successFlash = 'email confirm success. thank you. enjoy after login.'
      this.setSuccessFlashMessage('email confirm success. thank you. enjoy after login.');
      // go to login
      history.push('/login');
    }
  }



  // not use below
  async fetchData(pathname, id) {
    let { data } = await axios.get(
      `https://jsonplaceholder.typicode.com${pathname}`
    );
    console.log(data);
    data.length > 0 ? this.setData(data) : this.setSingle(data);
  }

  @action setData(data) {
    this.items = data;
  }

  @action setSingle(data) {
    this.item = data;
  }

  @action clearItems() {
    this.items = [];
    this.item = {};
  }

  @action authenticate() {
    /*
    return new Promise((resolve, reject) => {
      this.authenticating = true;
      setTimeout(() => {
        this.authenticated = !this.authenticated;
        this.authenticating = false;
        resolve(this.authenticated);
      }, 0);
    });
    */  
  }
}
