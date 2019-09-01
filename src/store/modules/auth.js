import request from '../../utils/request'
export default({
    namespaced: true,
    state: {
        loggedIn: true,
    },
    getters: {
        getLoggedInState: state => {
            return state.loggedIn
        },
    },
    mutations: {
        login(state, header){
            //アクセスに必要な認証情報をlocalStorageに保存
             // localstorageに次回操作に必要なheader情報を格納
             localStorage.setItem('Client', header['client'])
             localStorage.setItem('Token', header['access-token'])
             localStorage.setItem('Expiry',header['expiry'])
             localStorage.setItem('Uid', header['uid'])
             localStorage.setItem('TokenType',header['token-type'])
             state.loggedIn = true;
        },
        logout(state){
            localStorage.removeItem('Client')
            localStorage.removeItem('Token')
            localStorage.removeItem('Expiriy')
            localStorage.removeItem('Uid')
            localStorage.removeItem('TokenType')
            state.loggedIn = false;
        },
        update(state, header){
            //UIDを更新する
            localStorage.setItem('Uid', header['uid'])
            state.loggedIn = true;
        }
    },
    actions: {
        signUp( {commit}, payload){
            const options = {
                params: {
                    name: payload.user.name,
                    email: payload.user.email,
                    password: payload.user.password,
                    password_confirmation: payload.user.password_confirmation
                }
            }
            request.post('/auth',options).then( (response) => {
                commit('login', response.headers)
                commit('message/setMessage', {'message': '会員登録しました。ようこそ!!'}, {root: true})
                payload.router.push("/mypage")
            }, (error) => {
                commit('message/setMessage', {'message': '会員登録に失敗しました', 'type': 'error'}, {root: true} )
            })
        },
        signIn( {commit}, payload){
            const options = {
                params:{
                    email: payload.user.email,
                    password: payload.user.password
                }
            }

            request.post('/auth/sign_in', options).then( (response) => {
                commit('login', response.headers)
                commit('message/setMessage', {'message': "ログインしました"}, {root: true})
                payload.router.push("/mypage")
            }, (error) => {
                commit('message/setMessage', {'message': "ログインに失敗しました", 'type':'error'}, {root: true})
            })
        },
        signOut( {commit}, payload){
            request.delete('/auth/sign_out', options).then( (response) => {
                commit('logout')
                commit('message/setMessage', {'message': 'ログアウトしました', 'type':'success'}, {root: true})
                payload.router.push("/")
            }, (error) => {
                commit('message/setMessage', {'message': 'ログアウトに失敗しました', type:'error'}, {root: true})
            })
        }
    }
})