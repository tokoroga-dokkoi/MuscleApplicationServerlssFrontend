<template>
    <div id="header">
      <v-app-bar
      color="deep-purple accent-4"
      dark
      :height="80"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>筋トレアプリケーション</v-toolbar-title>
      </v-app-bar>
      <div id="login-header" v-if="login">
        <v-navigation-drawer
            v-model="drawer"
            absolute
            left
            temporary>
                <v-list nav dense>
                    <v-list-item-group
                        v-model="group"
                        active-class="deep-purple--text text-accent-4"
                    >
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-home</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Topページ</v-list-item-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-face</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>マイページ</v-list-item-title>
                        </v-list-item>


                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-twitter</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>みんなの投稿一覧</v-list-item-title>
                        </v-list-item>
                
                        <v-list-item @click="signOut">
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                ログアウト
                            </v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
        </v-navigation-drawer>
      </div>
      <div id="nologin-header" v-else>
        <v-navigation-drawer
            v-model="drawer"
            absolute
            left
            temporary>
                <v-list nav dense>
                    <v-list-item-group
                        v-model="group"
                        active-class="deep-purple--text text-accent-4"
                    >
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-home</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Topページ</v-list-item-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-twitter</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>みんなの投稿一覧</v-list-item-title>
                        </v-list-item>
                
                        <v-list-item @click="openLoginForm">
                            <v-list-item-icon>
                                <v-icon>mdi-login</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>ログイン</v-list-item-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>ユーザ登録</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
        </v-navigation-drawer>
      </div>
      <openDialog :dialog="dialog" @close="closeForm()">
        <userLoginForm slot="content" @close="closeForm()"></userLoginForm>
      </openDialog>
    </div>
</template>
<script>
import Dialog from '../parts/openDialog'
import UserLoginForm from '../parts/signInForm'
import * as AwsUtil from '../../utils/AwsUtil'
export default {
    data: () => ({
        drawer: false,
        dialog: false,
        group: null,
        login: false,
    }),
    created(){
        this.isLogin()
    },
    methods: {
        isLogin() {
            AwsUtil.isLogedin().then( (res) => {
                this.login = res
            })
        },
        openLoginForm() {
            this.drawer = false
            this.dialog = true
        },
        closeForm(){
            this.isLogin()
            this.dialog = false
        },
        async signOut(){
            try{
                AwsUtil.signOut()
                this.$store.commit('message/setMessage', {'message': 'ログアウトしました'}, {root: true})
                this.login = false
                this.$router.push('/')
            }catch(e){
                console.log(e)
                this.$store.commit('message/setMessage', {'message': 'ログアウトに失敗しました'}, {root: true})
            }
        }
    },
    components: {
        'openDialog': Dialog,
        'userLoginForm': UserLoginForm
    },
    watch: {
        group() {
            this.drawer = false
        },
    }
}
</script>
<style scoped>
#header{
    height: 80px
}
</style>
