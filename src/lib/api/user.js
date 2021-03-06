import axios from 'axios';

/*
export const emailConfirm = (confirm_token) => axios.post('/api/v1.0/user/emailConfirm/'+confirm_token);
export const resendEmailConfirm = (email) => axios.post('/api/v1.0/user/resendEmailConfirm/'+email);
export const forgotPassword = (email) => axios.post('/api/v1.0/user/forgotPassword/'+email);
export const isValidResetPasswordToken = (reset_token) => axios.post('/api/v1.0/user/isValidResetPasswordToken/'+reset_token);
export const resetPassword = (reset_token, password) => axios.post('/api/v1.0/user/resetPassword',{reset_token,password});
export const getProfile = (id) => axios.post('/api/v1.0/user/getProfile/'+id);
export const updateProfile = (id, password) => axios.post('/api/v1.0/user/updateProfile',{id,password});
*/

export const confirmEmail = (confirm_token) => axios.post('/v1/user/confirmEmail/'+confirm_token);
export const resendConfirmEmail = (email) => axios.post('/v1/user/resendConfirmEmail/'+email);
export const forgotPassword = (email) => axios.post('/v1/user/forgotPassword/'+email);
export const isValidResetPasswordToken = (reset_token) => axios.post('/v1/user/isValidResetPasswordToken/'+reset_token);
export const resetPassword = (resetToken, password) => axios.post('/v1/user/resetPassword',{resetToken,password});
export const getProfile = (UID) => axios.post('/v1/user/getProfile/'+UID);
export const updateProfile = (UID, displayname, email) => axios.post('/v1/user/updateProfile',{UID,displayname, email});
export const updatePassword = (UID, password) => axios.post('/v1/user/updatePassword',{UID, password});