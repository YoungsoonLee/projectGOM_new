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
  //@observable confirmPassword;
  @observable userInfo;
  @observable loggedInUserInfo;
  @observable error;
  @observable loading;
  @observable errorFlash;
  @observable successFlash;

  @observable originProfileEmail;
  @observable originProfileDisplayname;
  @observable profileEmail;
  @observable profileDisplayname;
  @observable profileProvider;

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
    //this.confirmPassword = '';
    this.error = null;
    this.loading = 'off';
    this.errorFlash = null;
    this.successFlash = null;

    this.originProfileEmail = null;
    this.originProfileDisplayname =null;
    this.profileEmail = null;
    this.profileDisplayname = null;
    this.profileProvider = null;

    //for signup and login
    this.userInfo = {
      displayname: '',
      email: '',
      password: ''
    }

    this.loggedInUserInfo = {
      uid: '',
      displayname: '',
      gravatar: '',
      balance: '0',
      gravatar: '',
    }
  }

  @action setProfileEmail(value){
    this.originProfileEmail = value;
    this.profileEmail = value;
  }

  @action setProfileDisplayname(value){
    this.originProfileDisplayname = value;
    this.profileDisplayname = value;
  }

  @action setProfileProvider(value){
    this.profileProvider = value;
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
    //this.userInfo.confirmPassword = '';

    this.setClearMessage();
  }

  @action setAuthenticated(auth, uid, displayname, balance, gravater) {
    // console.log("setAuth: ", uid, displayname);
    this.authenticated = auth;
    this.loggedInUserInfo.uid = uid;
    this.loggedInUserInfo.displayname = displayname;
    this.loggedInUserInfo.balance = balance;
    this.loggedInUserInfo.gravatar = gravater;
  }

  @action  setInitLoggedInUserInfo() {
    storage.remove('___GOM___');

    this.authenticated = false;

    this.loggedInUserInfo.uid = '';
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
    this.successFlash = msg;
    this.setLoading('off');
  }

  @action setErrorFlashMessage(msg) {
    this.errorFlash = msg;
    this.setLoading('off');
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
        this.setSuccessFlashMessage('Welcome ! ' + respData.data.data.displayname);

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
        //console.log('check auth: ', auth.data.data);
        await this.setAuthenticated(
          true,
          auth.data.data.Uid,
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

          // this.checkAuth();

          // flash message ... um error ... why ??
          // appState.setSuccessFlashMessage('Welcome ! ' + respData.data.data.displayname);
          // this.setSuccessFlashMessage('Welcome ! ' + respData.data.data.displayname);
  
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
      this.setErrorFlashMessage('token is invalid or has expired. try resend again.');
      history.push('/invalidConfirmEmail');
    }else{
      this.setSuccessFlashMessage('email confirm success. thank you. enjoy after login.');
      history.push('/login');
    }
  }

  async resendConfirmEmail() {

    if(!validator.isEmail(this.userInfo.email)) {
      //this.setError('Please input a valid email address.');
      this.setErrorFlashMessage('Please input a valid email address.');
    }else{
      this.setErrorFlashMessage(null);
    }

    if(!this.errorFlash) {
      let data = null;
      try{ 
        data = await UserAPI.resendConfirmEmail(this.userInfo.email);
        this.setInitUserInfo();
      }catch(err){
        //console.log(err);
        //this.setError(err.response.data.message);
        this.setErrorFlashMessage(err.response.data.message);
      }
      
      if(data) {
        this.setSuccessFlashMessage('Resend succeed.');
      }
    }
  }

  async logout(history, goto) {
    // check auth\
    // do not need call api
    // let { data } = await AuthAPI.logout();

    await this.checkAuth();

    await this.setInitUserInfo();

    await this.setInitLoggedInUserInfo();

    //this.setSuccessFlashMessage("Bye~~~, Hopely see you soon.");

    if (goto == "") {
      history.push('/');
    }else{
      history.push(goto);
    }
    
    
  }

  async forgotPassword(){
    if(!validator.isEmail(this.userInfo.email)) {
      this.setErrorFlashMessage('Please input a valid email address.');
    }else{
      this.setErrorFlashMessage(null);
    }

    if(!this.errorFlash) {
      let data = null;
      try{ 
        data = await UserAPI.forgotPassword(this.userInfo.email);
        this.setInitUserInfo();
      }catch(err){
        //console.log(err);
        this.setErrorFlashMessage(err.response.data.message);
      }
      
      if(data) {
        this.setSuccessFlashMessage('Send a password reset token to yor email. please check your email inbox or spam box.');
      }
    }
  }

  async isValidResetPasswordToken(token, history) {
    let data = null;
    try{ 
      data = await UserAPI.isValidResetPasswordToken(token);
      //console.log(data);
    }catch(err){
      //console.log(err);
      //this.errorFlash = err.response.data.message;
      this.setErrorFlashMessage(err.response.data.message);
      history.push('/forgotPassword');
    }
    
    if(data) {
      //this.successFlash = 'Reset Token is valid.'
      this.setSuccessFlashMessage('Reset Token is valid. Change password.');
    }
  }


  async resetPassword(resetToken, confirmPassword, history) {
    if ( !(validator.isLength(this.userInfo.password, {min:8, max: undefined})) || (validator.contains(this.userInfo.password, ' ')) ){
      this.setError('The password must be at least 8 characters long without space.');
    }else if ( !(validator.isLength(confirmPassword, {min:8, max: undefined})) || (validator.contains(confirmPassword, ' ')) ){
      this.setError('The confirm password must be at least 8 characters long without space.');
    }else if(this.userInfo.password !== confirmPassword){
      this.setError('Password does not match.');
    }else{
      this.setError(null);
    }

    if(!this.error) {
      let data = null;
      try{ 
        data = await UserAPI.resetPassword(resetToken, this.userInfo.password);
        this.setInitUserInfo();
      }catch(err){
        //console.log(err);
        //this.errorFlash = err.response.data.message;
        this.setErrorFlashMessage(err.response.data.message);
      }
      
      if(data) {
        //this.successFlash = 'Password is changed. please SIGN IN.'
        this.setSuccessFlashMessage('Password is changed. Please SIGN IN.');
        //console.log(history);
        history.push('/login');
      }
    }
  }


  async getProfile(history) {
    //this.setInitUserInfo();

    await this.checkAuth();

    if(!this.loggedInUserInfo.uid) {
      this.setErrorFlashMessage('Need login first');

      // clear storage
      await this.setInitLoggedInUserInfo(); //first remove cookie
      await this.checkAuth();

      //go to login
      history.push('/login');
    }else{

      let profile = null;
      try{
        profile = await UserAPI.getProfile(this.loggedInUserInfo.uid);
      }catch(err){
        this.setErrorFlashMessage(err.response.data.message);
      }

      if(profile){
        this.setProfileEmail(profile.data.data.Email);
        this.setProfileDisplayname(profile.data.data.Displayname);
        this.setProfileProvider(profile.data.data.Provider);

        this.setLoading('off');
      }else{
        this.setErrorFlashMessages('Something wrong to get profile.');
      }
    }
  }

  
  async updateProfile(history) {
    // TODO: compare original value !!!
    if (this.originProfileDisplayname == this.profileDisplayname && this.originProfileEmail == this.profileEmail) {
      // do nothing
      this.setLoading('off');
    }else{
      // using flash message
      if ( 
        !(validator.isLength(this.profileDisplayname, {min:4, max: 16})) || 
        (validator.contains(this.profileDisplayname, ' ')) || 
        !(validator.isAlphanumeric(this.profileDisplayname))
        ){
        //this.setError('A displayname has 4~16 letters/numbers without space.');
        this.setErrorFlashMessage('A displayname has 4~16 letters/numbers without space.')
      }else if(!validator.isEmail(this.profileEmail)) {
        //this.setError('Please input a valid email address.');
        this.setErrorFlashMessage('Please input a valid email address.')
      }else{
        this.setErrorFlashMessage(null);
      }

      if(!this.errorFlash) {
        let data = null;
        try{ 
          data = await UserAPI.updateProfile(this.loggedInUserInfo.uid, this.profileDisplayname, this.profileEmail);
        }catch(err){
          this.setErrorFlashMessage(err.response.data.message);
        }
        
        if(data) {
          await this.setInitLoggedInUserInfo(); //first remove cookie
          await this.checkAuth();
          this.setSuccessFlashMessage('Profile is changed. please re-sign in.');
          history.push('/login');
        }
      }
    }
  }
  
  async updatePassword(newpassword,confirmPassword, history) {
    this.setInitUserInfo();

    // using error message

    if ( !(validator.isLength(newpassword, {min:8, max: undefined})) || (validator.contains(newpassword, ' ')) ){
      this.setError('The password must be at least 8 characters long without space.');
    }else if ( !(validator.isLength(confirmPassword, {min:8, max: undefined})) || (validator.contains(confirmPassword, ' ')) ){
      this.setError('The confirm password must be at least 8 characters long without space.');
    }else if(newpassword !== confirmPassword){
      this.setError('New Password and Confirm Password does not match.');
    }else{
      this.setError(null);
    }

    if(!this.error) {
      let data = null;
      try{ 
        data = await UserAPI.updatePassword(this.loggedInUserInfo.uid, newpassword);
      }catch(err){
        this.setError(err.response.data.message);
      }
      
      if(data) {
        await this.setInitLoggedInUserInfo(); //first remove cookie
        await this.checkAuth();
        this.setSuccessFlashMessage('Password is changed. please re-sign in.');
        history.push('/login');
      }
    }
  }
  
  
  // ------------------------------------------------------------------------------------------------------------
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
