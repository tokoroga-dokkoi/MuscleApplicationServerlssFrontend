<template>
    <v-card>
        <v-card-title>
            <span class="headline">ログイン</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout wrap>
                        <v-flex xs12>
                        <MyTextField
                            v-model="email"
                            label="メールアドレスもしくはユーザ名"
                            :rules="formInfo.emailRules"
                            :counter="100">
                        </MyTextField>
                        <MyPasswordField
                            v-model="password"
                            label="パスワード"
                            :rules="formInfo.userPasswordRules"
                        >
                        </MyPasswordField>
                        </v-flex>
                    </v-layout>
                    <v-btn medium color="primary" @click="userSignIn">
                        ログイン
                    </v-btn>
                    <v-btn medium color="primary" @click="close(false)">
                        閉じる
                    </v-btn>
                </v-form>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script>
import myTextField     from './formInputText'
import myPasswordField from './formPassword'
import MyAlert         from './alert'
import * as UserUtil   from '../../utils/AwsUtil'
import store from '../../store/store'
export default {
    data: () => ({
        valid: true,
        email: "",
        password:"",
        formInfo: {
            emailRules: [
                v => !!v || "メールアドレスもしくはユーザ名を入力してください",
            ],
            userPasswordRules: [
                v => !!v || "パスワードを入力してください",
            ],
        }
    }),
    components: {
        'MyTextField': myTextField,
        'MyPasswordField': myPasswordField,
        MyAlert
    },
    methods:{
        async userSignIn(){
            try{
                await UserUtil.signIn(this.email, this.password).then(user => {
                    // Tokenをローカルに保存
                    const token = user.signInUserSession.idToken.jwtToken
                    localStorage.setItem("Authorization", token)
                    this.email = ''
                    this.password = ''
                    this.close()
                    this.$store.commit('message/setMessage', {'message': 'ログインに成功しました'}, {root: true})
                    this.$store.dispatch('session/setUserInfo', {root: true})
                    this.$router.push('/mypage')
                })
            } catch(e){
                console.log(e)
                this.close()
                this.$store.commit('message/setMessage', {'message': 'ログインに失敗しました', 'type': 'error'}, {root: true})
            }
        },
        close(){
            this.$emit('close')
        }
    }
}
</script>

