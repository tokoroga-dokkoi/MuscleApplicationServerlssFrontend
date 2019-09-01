<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline"> Todo完了</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-form ref="form" v-model="valid" lazy-validation>
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
                                    v-model="todo.complete_plan_date"
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
import request from '../../utils/request'
import store from '../../store/store'
export default {
    props: ["todo"],
    data: () => ({
        valid: true,
        comment: "ToDoを完了しました!!",
        formInfo: {
            taskCommentRules: [
                v => (v && v.length <= 50) || "50文字以内で入力してください"
            ]
        }
    }),
    methods: {
        taskComplete(){
            const options = {
                auth: true,
                params: {
                    todo: {
                        comment: this.comment,
                        clear_date: this.todo.complete_plan_date
                    },
                }
            }

            request.patch(`/api/v1/todo/${this.todo.todo_id}/complete`, options).then( (response) => {
                this.$store.commit('message/setMessage', {'message': 'ToDoを完了しました'}, {root: true})
                this.$emit("complete", response.data)
                this.close()
            },(error) => {
                if(error.response.status === 403){
                    this.$store.commit('message/setMessage', {'message':'不正な操作です', 'type': 'error'}, {root: true})
                }else{
                    this.$store.commit('message/setMessage', {'message':'更新に失敗しました。やり直してください', 'type':'error'}, {root: true})
                }
                this.close()
            })
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


