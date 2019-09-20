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
                endpoint: "http://localhost:3000"
                //endpoint: process.env.VUE_APP_API_GATEWAY_BASE_URL
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

export async function CurrentUser(){
    return Auth.currentAuthenticatedUser()
}

export async function isLogedin(){
    let state = await Auth.currentAuthenticatedUser().then( (user) => {
        return Promise.resolve(true)
    }).catch((error) => {
        console.log(error)
        return Promise.resolve(false)
    })
    return state
}
export function GetUserNameAccessToken(){
    CurrentUser().then( (response) => {
        user_name = response["username"]
        access_token = response.signInUserSession.accessToken.jwtToken
        user_data = {
            "name": user_name,
            "accessToken": access_token
        }
        return user_data
    },(error) => {
        user_data = {
            "name": "",
            "accessToken": ""
        }
        return user_data
    })
}

export function signOut(){
    return Auth.signOut();
}

export async function getAPI(apiName, path){
    if(apiName === ''){
        apiName = 'MuscleApi'
    }
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const headers = {
        Authorization: token
    }
    return API.get(apiName, path, {
        headers: headers
    })    
}

export async function postAPI(apiName, path, payload){
    if(apiName === ''){
        apiName = 'MuscleApi'
    }
    // header and payload
    const user  = await Auth.currentAuthenticatedUser()
    const id_token = user.signInUserSession.idToken.jwtToken
    const headers = {
        Authorization: id_token,
    }
    const http_data = {
        headers: headers,
        body: payload
    }
    return API.post(apiName, path, http_data)
}

export async function putAPI(path, payload){
    const apiName = 'MuscleApi'
    const user     = await Auth.currentAuthenticatedUser()
    const id_token = user.signInUserSession.idToken.jwtToken
    const headers = {
        Authorization: id_token
    }
    const http_data = {
        headers: headers,
        body: payload
    }

    return API.put(apiName, path, http_data)

}

// Non export Function
