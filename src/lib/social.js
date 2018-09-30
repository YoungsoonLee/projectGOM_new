import hello from 'hellojs';

hello.init({
    facebook: 1796633277048096,
    google: '407921582266-eejp551k7gsshrngm4qc2qqvh39hfmn2.apps.googleusercontent.com'
}, {redirect_uri: '/redirect.html'});

export default(function () {
    return {
        facebook: () => {
            return new Promise((resolve, reject) => {
                // hellojs 는 일반 Promise 가 아닌 Promise A+ 를 사용하므로, Promise 로 감싸줌
                hello.login('facebook', { scope: {basic: 'public_profile,email',} }).then(
                    auth => resolve(auth),
                    e => reject(e)
                );
            })
        },
        google: () => {
            return new Promise((resolve, reject) => {
                hello.login('google', { scope: 'email' }).then(
                    //auth => resolve(auth.authResponse.access_token),
                    auth => resolve(auth),
                    e => reject(e)
                );
            })
        }
    }
})();