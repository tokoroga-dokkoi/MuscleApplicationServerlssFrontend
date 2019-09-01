<template>
    <div id="content">
        <div id="hero">
            <v-img :src="image_src" class="white-text" >
                <v-container fill-height fluid>
                    <v-layout fill-height align-center>
                        <v-flex xs12 flexbox>
                            <h3 class="headline">筋トレアプリケーションへようこそ</h3>
                            <h4 class="headline">日々の筋トレメニューをToDo管理、トレーニング実績をグラフで可視化します</h4>
                            <v-btn large color="error" @click="openDialog">機能を見てみる</v-btn>
                            <v-btn large color="primary" @click="openForm" >ユーザ登録する</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-img>
        </div>
        <appIntroDialog :dialog="dialog"></appIntroDialog>
        <openDialog :dialog="formDialog" @close="closeForm">
            <userRegisterForm slot="content" @close="closeForm"></userRegisterForm>
        </openDialog>
    </div>
</template>
<script>
import DialogFill       from '../parts/appIntroDialog'
import Dialog           from '../parts/openDialog'
import UserRegisterForm from '../parts/singUpForm'
export default {
    data: () => ({
        image_src: require("../assets/hero.jpg"),
        dialog: false,
        formDialog: false,
    }),
    methods:{
        openDialog(){
            this.dialog = true;
        },
        openForm(){
            this.formDialog = true;
        },
        closeForm(){
            console.log('close')
            this.formDialog = false;
        }
    },
    components: {
        'appIntroDialog': DialogFill,
        'openDialog': Dialog,
        'userRegisterForm': UserRegisterForm
    }
}
</script>

<style scoped>
.hero{
    background-image: url("../../assets/hero.jpg")
}
.headline{
    color: white;
}
</style>
