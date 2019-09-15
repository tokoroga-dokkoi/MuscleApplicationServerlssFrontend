<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                    <v-layout wrap>
                        <v-flex xs12>
                            <MyTextField
                                v-model="todo.name"
                                label="ToDo名"
                                :rules="formInfo.taskNameRules"
                                :counter="30"
                            >
                            </MyTextField>

                            <MyTextField
                                v-model="todo.weight"
                                label="重量"
                                :rules="formInfo.taskWeigthRules"
                            >
                            </MyTextField>

                            <MyTextField
                                v-model="todo.set"
                                label="セット数"
                                :rules="formInfo.taskSetRules">
                            </MyTextField>

                            <MyDateField
                                v-model="todo.complete_plan_date"
                                label="完了予定日"
                            >
                            </MyDateField>
                        </v-flex>
                    </v-layout>
                    <v-btn medium color="primary" :disable="!valid" @click="taskRegist" class="mr-2">登録</v-btn>
                    <v-btn medium color="primary" @click="close" class="ml-2">閉じる</v-btn>
                </v-form>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script>
import MyTextField from "../parts/formInputText"
import MyDateField from "../parts/formDate"
import * as AwsUtil from "../../utils/AwsUtil"
import store from '../../store/store'

export default {
    props: ["todo", "editFlg"],
    data: () => ({
        valid: true,
        lazy: false,
        name: "",
        weight: 0,
        set: 0,
        completePlanDate: new Date().toISOString().substr(0,10),
        formInfo: {
            taskNameRules: [
                v => !!v || "タスク名を入力してください",
                v => (v && v.length <= 30) || "30文字以内で入力してください"
            ],
            taskWeigthRules:[
                v => !!v || "重さを入力してください",
                v => /\d{1,4}/.test(v) || "数字で入力してください"
            ],
            taskSetRules: [
                v => !!v || "セット数を入力してください",
                v => /\d{1,4}/.test(v) || "数字で入力してください"
            ]
        },
    }),
    computed:{
        formTitle() {
            return this.editFlg === -1 ? "Todo登録" : "ToDo編集"
        }
    },
    components: {
        'MyTextField': MyTextField,
        'MyDateField': MyDateField
    },
    methods: {
        async taskRegist(){
            //入力項目検査
            if (!this.$refs.form.validate()){
                return
            }
            this.snackbar = true
            // ユーザ情報を取得
            let user_name = ''
            let access_token = ''
            await AwsUtil.CurrentUser().then( (response) => {
                user_name    = response["username"]
                access_token = response.signInUserSession.accessToken.jwtToken
            }, (error) => {
                this.$store.commit('message/setMessage', {'message': '登録に失敗しました','type': 'error'}, {root: true})
                this.close()
                return
            })
            const body = {
                access_token: access_token,
                user_name: user_name,
                name: this.todo.name,
                weight: this.todo.weight,
                set: this.todo.set,
                clear_plan: this.todo.complete_plan_date
            }
            if(this.editFlg === -1){
                this.newTask(body)
            }else{
                this.updateTask(body)
            }
        },
        async newTask(body){
            //requestUrl
            const path = '/todos'
            try{
                await AwsUtil.postAPI('',path, body).then((response) => {
                    this.$store.commit('message/setMessage', {'message': '登録が完了しました'}, {root: true})
                    this.$emit("append", response["item"])
                })
            } catch(e){
                console.log(e)
                this.$store.commit('message/setMessage', {'message': '登録に失敗しました', 'type': 'error'}, {root: true})
            }finally{
                this.close()
            }
        },
        updateTask(options){
            //request
            request.patch(`/api/v1/todo/${this.todo.todo_id}`, options).then( (response) => {
                //更新内容を適用する
                this.$store.commit('message/setMessage', {'message': '更新が完了しました'}, {root: true})
                this.$emit("update", response.data)
            }, (error) => {
                this.$store.commit('message/setMessage', {'message': '更新に失敗しました', 'type': 'error'}, {root: true})
            })
        },
        close(){
            this.$emit("close")
        }
    }
}
</script>

