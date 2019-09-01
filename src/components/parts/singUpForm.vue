<template>
    <v-card>
        <v-card-title>
            <span class="headline">ユーザ登録</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout wrap>
                        <v-flex xs12>
                        <MyTextField 
                            v-model="name"
                            label="ユーザ名"
                            :rules="formInfo.userNameRules"
                            :counter="20"
                            >
                        </MyTextField>
                        <MyTextField
                            v-model="email"
                            label="メールアドレス"
                            :rules="formInfo.emailRules"
                            :counter="100">
                        </MyTextField>
                        <MyPasswordField
                            v-model="password"
                            label="パスワード"
                            :rules="formInfo.userPasswordRules"
                        >
                        </MyPasswordField>
                        <MyPasswordField
                            v-model="password_confirmation"
                            label="パスワード(確認用)"
                            :rules="[passwordConfirmationRules]"
                        >
                        </MyPasswordField>
                        </v-flex>
                    </v-layout>
                    <v-btn medium color="primary" @click="userSignUp">
                        登録する
                    </v-btn>
                    <v-btn medium color="normal" @click="close" class="mx-3">
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
import * as UserUtil   from '../../utils/AwsUtil'
import store from '../../store/store'
export default {
    data: () => ({
        valid: true,
        name:"",
        email: "",
        password:"",
        password_confirmation: "",
        formInfo: {
            userNameRules: [
                v => !!v || "ユーザ名を入力してください",
                v => (v && v.length <=20) || "ユーザ名は２0文字以下で入力してください"
            ],
            emailRules: [
                v => !!v || "メールアドレスを入力してください",
                v => /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(v) || "メールアドレスが不正です"
            ],
            userPasswordRules: [
                v => !!v || "パスワードを入力してください",
                v => (v && v.length >= 8) || "パスワードは8文字以上で入力してください",
                v => /\d{1,}/.test(v) || "パスワードには１文字以上の数字を含めてください",
                v => /[A-Z]{1,}/.test(v) || "パスワードには１文字以上の大文字を含めてください",
                v => /[\x22\#$%&@'()*+,-./!]/.test(v) || "パスワードには１文字以上の記号を含めてください"

            ],
        }
    }),
    computed: {
        passwordConfirmationRules() {
            return () => (this.password === this.password_confirmation) || 'パスワードが一致しません'
        },
    },
    components: {
        'MyTextField': myTextField,
        'MyPasswordField': myPasswordField
    },
    methods:{
        async userSignUp(){
            // パスワードを検証
            if(!this.$refs.form.validate()){
                return
            }
            try{
                await UserUtil.signUp(this.name, this.password, this.email)
                this.$store.commit('message/setMessage', {'message': '登録メールアドレスへメールを送信しました。ユーザ登録を完了させてください'}, {root: true})
            }catch (e){
                if (e.code === "UsernameExistsException"){
                    this.$store.commit('message/setMessage', {'message': 'すでに存在するユーザです', 'type':'error'}, {root: true})
                }
                else{
                    this.$store.commit('message/setMessage', {'message': '登録に失敗しました', 'type':'error'}, {root: true})
                }
            }finally{
                this.close()
            }
        },
        close(){
            this.name     = ''
            this.email    = ''
            this.password = ''
            this.password_confirmation = ''
            this.$emit('close')
        }
    }
}
</script>

