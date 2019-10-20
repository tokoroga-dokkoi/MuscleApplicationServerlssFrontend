<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-alert type="error" v-if="error">
                {{ error_message }}
            </v-alert>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-btn text icon color="green" @click="appendMenu(menu)">
                                <v-icon>mdi-plus-box</v-icon>追加
                            </v-btn>
                        </v-flex>
                        <v-flex xs12>
                            <v-card class="mx-auto my-1" v-for="(menu, index) in menuList" :key="menu.id">
                                <v-card-text v-if="menu.is_input_complete" class="font-weight-bold">
                                    <v-btn text  icon color="red" @click="deleteMenu(index)">
                                        <v-icon>mdi-minus-box</v-icon>削除
                                    </v-btn>
                                    <p>{{ menu.name }}: {{ menu.weight}}KG × {{ menu.set}}セット</p>
                                </v-card-text>
                                <v-card-text v-else>
                                    <p class="text--primary">
                                        Menu{{ index + 1}}
                                    </p>
                                    <v-flex xs12>
                                        <v-btn text icon color="green" class="mr-2" @click="completeMenu(index)">
                                            <v-icon text icon color="green">mdi-check-circle</v-icon>入力完了
                                        </v-btn>
                                        <v-btn text  icon color="red" class="ml-2" @click="deleteMenu(index)">
                                            <v-icon>mdi-minus-box</v-icon>削除
                                        </v-btn>
                                    </v-flex>
                                    <MyTextField
                                        v-model="menu.name"
                                        label="ToDo名"
                                        :rules="formInfo.taskNameRules"
                                        :counter="30"
                                    >
                                    </MyTextField>

                                    <MyTextField
                                        v-model="menu.weight"
                                        label="重量"
                                        :rules="formInfo.taskWeigthRules"
                                    >
                                    </MyTextField>

                                    <MyTextField
                                        v-model="menu.set"
                                        label="セット数"
                                        :rules="formInfo.taskSetRules">
                                    </MyTextField>
                                </v-card-text>
                            </v-card>
                            <MyDateField
                                v-model="completePlanDate"
                                label="完了予定日"
                            >
                            </MyDateField>
                        </v-flex>
                    </v-layout>
                    <v-btn medium color="primary" v-if="!loading" :disable="!valid" @click="taskRegist" class="mr-2">登録</v-btn>
                    <v-btn medium color="primary" v-else>
                        <v-icon text icon color="white">mdi-spin</v-icon>登録中
                    </v-btn>
                    <v-btn medium color="primary" v-if="!loading" @click="close" class="ml-2">閉じる</v-btn>
                </v-form>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script>
import MyTextField from "../parts/formInputText"
import MyDateField from "../parts/formDate"
import MyAlertBox  from "../parts/alert"
import * as AwsUtil from "../../utils/AwsUtil"
import store from '../../store/store'

export default {
    props: ["todo", "editFlg"],
    data: () => ({
        valid: true,
        lazy: false,
        menu: {},
        error: false,
        error_message: "未入力の項目があります",
        menuNum: 1,
        menuList: [{
            'id': 0,
            'name': '',
            'set': '',
            'weight': '',
            'is_input_complete': false
        }],
        menuNum: 2,
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
        loading: false
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
        appendMenu(menu){
            //入力項目検査
            if (!this.$refs.form.validate()){
                this.error         = true
                return
            }
            this.error         = false
            const latest_index = this.menuList.length
            this.menuList[latest_index - 1]["is_input_complete"] = true
            const empty_menu = {
                'id': this.menuNum,
                'name': '',
                'set': '',
                'weight':'',
                'is_input_complete': false
            }
            this.menuList.push(empty_menu)
            this.menuNum = this.menuNum + 1
        },
        completeMenu(index){
            if(!this.$refs.form.validate()){
                this.error = true
                return
            }
            this.error = false
            this.menuList[index]["is_input_complete"] = true
        },
        deleteMenu(index){
            //メニューが0の場合は削除しない
            if(this.menuList.length-1 <= 0){
                return 
            }
            //indexで与えられたメニューを削除
            this.menuList.splice(index, 1)
        },
        createEditData(){
            /*
                Todoを編集するデータを作成する
            */
           if(this.editFlg > -1){
               this.menuList = this.todo.menu.map(function(menu){
                   const data = {
                       'id': this.menuNum,
                       'name': menu.name,
                       'set': menu.set,
                       'weight': menu.weight,
                       'cleared': menu.cleared,
                       'is_input_complete': false
                   }
                   this.menuNum = this.menuNum + 1
                   return data
               }.bind(this))
               this.completePlanDate = this.todo.clear_plan
           }
        },
        async taskRegist(){
            //入力項目検査
            if (!this.$refs.form.validate() || this.menuList.length < 0){
                return
            }
            this.loading = true
            this.snackbar = true
            // menuから不要部分を取り出す
            const formatMenuList = this.menuList.map(function(menu){
                return {
                    name: menu.name,
                    weight: menu.weight,
                    set: menu.set,
                    cleared: false
                }
            })
            const body = {
                clear_plan: this.completePlanDate,
                menu: formatMenuList
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
                    console.log(response["item"])
                    this.$emit("append", response["item"])
                })
            } catch(e){
                console.log(e)
                this.$store.commit('message/setMessage', {'message': '登録に失敗しました', 'type': 'error'}, {root: true})
            }finally{
                this.loading = false
                this.close()
            }
        },
        async updateTask(options){
            //request
            const path   = `/todos/${this.todo.id}`
            const formatMenuList = this.menuList.map(function(menu){
                return {
                    name: menu.name,
                    weight: menu.weight,
                    set: menu.set,
                    cleared: false
                }
            })
            const body = {
                'id': this.todo.id,
                'user_name': this.todo.user_name,
                'menu': formatMenuList,
                'clear_plan': this.completePlanDate
            }
            try{
                await AwsUtil.putAPI(path, body).then((response) => {
                    this.$store.commit('message/setMessage', {'message': '更新が完了しました'}, {root: true})
                    //データを更新する
                    this.$emit("update", response.item)
                })
            } catch(e){
                console.log(e)
                this.$store.commit('message/setMessage', {'message': '更新に失敗しました', 'type':'error'}, {root: true})
            }finally{
                this.loading = false
                this.close()
            }
        },
        close(){
            this.menuList = [{
                'id': 0,
                'name': '',
                'set': '',
                'weight': '',
                'is_input_complete': false
            }]
            this.menuNum = 1
            this.error   = false
            this.$emit("close")
        },
    },
    watch: {
        todo: {
            immediate: true,
            handler: 'createEditData'
        }
    }
}
</script>

