export default ({
    namespaced: true,
    state: {
        message: '',    // 表示メッセージ
        type: 'success' //クラスに利用
    },
    getters: {
        getMessage: state => {
            return state.message
        }
    },
    mutations: {
        setMessage(state, {message, type} ){
            //フラッシュメッセージをstoreに保存する
            state.message = message
            state.type    = type || 'success'
            console.log(state)
        },
        clearMessage(state){
            //フラッシュメッセージを削除する
            state.message = ''
            state.type    = 'success'
        }
    }
})