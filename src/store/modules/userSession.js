import * as AwsUtil from '../../utils/AwsUtil'

export default ({
    namespaced: true,
    state: {
        user_name: '',
    },
    getters: {
        getUserName: state => {
            return state.user_name
        }
    },
    mutations: {
        register(state, user_name){
            /**
             * ユーザ情報をVueStoreに保存するメソッド
             * @param { state } VueState Vuexの状態。必須
             * @param { user_name } str ユーザ名
             */
            state.user_name = user_name
        },
        delete(state) {
            /**
             * VueStoreからユーザ情報を削除するメソッド
             */
            state.user_name = ''
            state.id_token  = ''
        }
    },
    actions: {
        async setUserInfo({commit}) {
            await AwsUtil.CurrentUser().then( (response) => {
                const user_name = response["username"]
                commit('register', user_name)
            }, (error) => {
                state.user_name = ''
                console.log(error)
                console.log("User Info Not Found")
            })
        },
        deleteUserInfo({commit}) {
            commit('delete')
        },

    }
})

