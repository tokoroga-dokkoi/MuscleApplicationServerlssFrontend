import Amplify, {
    Auth,
    API
} from 'aws-amplify'


Amplify.Logger.LOG_LEVEL = 'DEBUG';

// AWS Configure Setting
Amplify.configure({
    Auth: {
        region: process.env.VUE_APP_AWS_REGION,
        identityPoolId: process.env.VUE_APP_IDENTITY_POOL_ID,
        userPoolId: process.env.VUE_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.VUE_APP_USER_POOL_WEB_CLIENT_ID,
        storage: window.sessionStorage
    },
    API: {
        endpoints: [
            {
                name: 'MuscleApi',
                endpoint: process.env.VUE_APP_API_GATEWAY_BASE_URL
            }
        ]
    }
});


export function signUp(username, password, email){
    return Auth.signUp({
        username,
        password,
        attributes: {
            email
        }
    });
}

export function signIn(username, password){
    return Auth.signIn({
        username,
        password
    });
}

export function CurrentSession(){
    return Auth.currentSession()
}

export function signOut(){
    return Auth.signOut();
}

export async function getAPI(apiName, path){
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const headers = {
        Authorization: token
    }
    console.log(path)
    return API.get(apiName, path, {
        headers: headers
    })
}