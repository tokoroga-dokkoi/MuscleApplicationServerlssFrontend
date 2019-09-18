<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline"> Todo完了</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                 :value="todo.name"
                                 label="Todo名"
                                 :readonly="true"
                                >
                                </v-text-field>

                                <v-text-field
                                    :value="todo.weight"
                                    label="重さ"
                                    :readonly="true"
                                >
                                </v-text-field>
                                
                                <v-text-field
                                    :value="todo.set"
                                    label="セット数"
                                    :readonly="true"
                                >
                                </v-text-field>

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
                        <v-btn medium color="primary" @click="taskComplete">投稿</v-btn>
                        <v-btn medium color="primary" @click="close">閉じる</v-btn>
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
        comment: "ToDoを完了しました!!",
        clear_date: "",
        formInfo: {
            taskCommentRules: [
                v => (v && v.length <= 50) || "50文字以内で入力してください"
            ]
        }
    }),
    methods: {
        taskComplete(){
            // validate
            if(!this.$refs.form.validate()){
                return
            }
            this.snackbar=true
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
            const path = `/todos/${this.todo.id}`
            try{
                AwsUtil.putAPI(path, body).then( (response) => {
                    // メッセージ出力
                    this.$store.commit('message/setMessage', {'message': 'ToDoを完了しました'}, {root: true})
                    //入力データを渡す
                    let complete_todo = Object.assign({},this.todo)
                    complete_todo["clear_date"] = this.clear_date
                    this.$emit("complete", complete_todo)
                    this.close()
                })
            } catch(e){
                this.$store.commit('message/setMessage', {'message': '完了処理に失敗しました。再度やり直してください', 'type':'error'}, {root: true})
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


