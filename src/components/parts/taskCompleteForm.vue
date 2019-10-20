<template>
    <div>
        <v-card>
            <v-alert type="error" v-if="lazy">未入力の項目があります</v-alert>
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title class="headline">Todo完了登録</v-list-item-title>
                    <v-list-item-subtitle>  登録日{{ todo.created_at }} </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-text>
                <v-row align="center">
                    <v-col class="display-1" cols="6">
                        {{ menuLength}}メニュー
                    </v-col>
                    <v-col cols="6">
                        <v-icon size=50>
                            mdi-dumbbell
                        </v-icon>
                    </v-col>
                </v-row>

                <v-list-item 
                    v-for="(menu,index) in todo.menu"
                    :key="index"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-numeric-{{ index+1 }}-box-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        {{ menu.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ menu.weight }}KG × {{ menu.set}}セット
                    </v-list-item-subtitle>
                </v-list-item>
                <v-container grid-list-md>
                    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                        <v-layout wrap>
                            <v-flex xs12>
                                <MyDateField
                                    v-model="clear_date"
                                    label="完了日"
                                >
                                </MyDateField>

                                <MyTextField
                                    v-model="comment"
                                    label="コメント"
                                    :rules="formInfo.taskCommentRules"
                                >
                                </MyTextField>
                            </v-flex>
                        </v-layout>
                        <v-btn medium color="primary" v-if="!loading" :disable="!valid" @click="taskComplete" class="mr-2">登録</v-btn>
                        <v-btn medium color="primary" class="mr-2" v-else>
                            <v-icon text icon color="white">mdi-spin</v-icon>登録中
                        </v-btn>
                        <v-btn medium color="primary" v-if="!loading" @click="close" class="ml-2">閉じる</v-btn>
                    </v-form>
                </v-container>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import MyTextField from "../parts/formInputText"
import MyDateField from "../parts/formDate"
import * as AwsUtil from "../../utils/AwsUtil"
import store from '../../store/store'
export default {
    props: ["todo"],
    data: () => ({
        valid: true,
        lazy: false,
        alert: false,
        loading: false,
        comment: "ToDoを完了しました!!",
        clear_date: "",
        formInfo: {
            taskCommentRules: [
                v => (v && v.length <= 50) || "50文字以内で入力してください"
            ]
        }
    }),
    computed: {
        menuLength(){
            if(!this.todo){
                return 0
            }
            return this.todo.menu.length
        }
    },
    methods: {
        async taskComplete(){
            // validate
            if(!this.$refs.form.validate()){
                this.alert = true
                return
            }
            this.alert    = false
            this.loading  = true
            this.snackbar = true
            // 日付Check
            if(this.clear_date === ""){
                const today = new Date()
                this.clear_date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
            }
            // ユーザ情報を取得
            const body = {
                id: this.todo.id,
                clear_date: this.clear_date,
                comment: this.comment
            }
            // リクエスト
            const path = `/todos/${this.todo.id}/complete`
            try{
                await AwsUtil.putAPI(path, body).then( (response) => {
                    // メッセージ出力
                    this.$store.commit('message/setMessage', {'message': 'ToDoを完了しました'}, {root: true})
                    //入力データを渡す
                    let complete_todo = Object.assign({},this.todo)
                    complete_todo["clear_date"] = this.clear_date
                    this.$emit("complete", complete_todo)
                })
            }catch(e){
                console.log(e)
                this.$store.commit('message/setMessage', {'message': '完了処理に失敗しました。再度やり直してください', 'type':'error'}, {root: true})
            }finally{
                //入力パラメータを初期化する
                this.clear_date = ""
                this.comment    = "Todoを完了しました"
                this.loading    = false
                this.alert      = false
                this.close()
            }
        },
        close(){
            this.$emit("close")
        }
    },
    components: {
        'MyTextField': MyTextField,
        'MyDateField': MyDateField
    }
}
</script>


