<template>
    <div>
        <v-container>
            <v-toolbar flat color="white">
                <v-toolbar-title>ToDo一覧</v-toolbar-title>
                <v-divider
                    class="mx-2"
                    inset
                    vertical
                >
                </v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mb-2" @click="openDialog">ToDo登録</v-btn>
            </v-toolbar>
            <openDialog :dialog="dialog" @close="closeForm">
                <taskRegisterForm slot="content" :editFlg="editIndex" :todo="todo" @close="closeForm" @append="appendTodo($event, todo)" @update="updateTodo($event,todo)"></taskRegisterForm>
            </openDialog>
            <openDialog :dialog="completeDialog" @close="closeForm">
                <taskCompleteForm slot="content" :todo="todo" @complete="afterComplete($event, todo)" @close="closeForm"></taskCompleteForm>
            </openDialog>
            <myDataTable :headers="headers" :items="todos" @edit="editForm($event, todo)" @delete="deleteConfirm($event, todo)" @complete="completeTodo($event,todo)"></myDataTable>
            <v-layout align-center justify-center row>
                <v-flex xs6>
                    <myPieGraph ref="graph" :dataset="dataSet" :datalabel="dataLabel"></myPieGraph>
                </v-flex>
                <v-flex xs6>
                    <myCompleteGraph ref="completegraph" :dataset="lineData"></myCompleteGraph>
                </v-flex>
            </v-layout>
            <v-layout row mt-4>
                <v-flex xs12 d-flex>
                    <mySelectBox :todos="completeTodos" :label="'トレーニングを選択'" @get="getWeightSetLine($event, training_name)"></mySelectBox>
                </v-flex>
            </v-layout>

            <v-layout align center justify-center row>
                <v-flex xs6 >
                    <myWeightGraph :datasets="weightData" v-show="isShowGraph"></myWeightGraph>
                </v-flex>
                <v-flex xs6>
                    <myWeightGraph :datasets="setData" v-show="isShowGraph"></myWeightGraph>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import Dialog from '../parts/openDialog'
import TaskRegisterForm from '../parts/taskRegisterForm'
import TaskCompleteForm from '../parts/taskCompleteForm'
import DataTable from '../parts/dataTable'
import PieChart  from '../parts/piechart'
import LineChart from '../parts/linechart'
import SelectBox from '../parts/selectBox'
import SetWeightLineChart from '../parts/linechartSetWight' 
import request from '../../utils/request'
import * as AwsUtil  from '../../utils/AwsUtil'
import store from '../../store/store'
export default {
    data: () => ({
        dialog: false,
        completeDialog: false,
        todo: {
            name: "",
            weight: "",
            set: "",
            complete_plan_date: new Date().toISOString().substr(0,10),
        },
        editIndex: -1,
        headers: [
            {
                text: "ToDo名",
                align: "left",
                sortable: false,
                value: "name"
            },
            {
                text: "重さ",
                sortable: false,
                value: "weight"
            },
            {
                text: "セット数",
                sortable: false,
                value: "set"
            },
            {
                text: "登録日",
                sortable: true,
                value: "created_at"
            },
            {
                text: "完了予定日",
                sortable: true,
                value: "clear_plan"
            }
        ],
        todos: [{
            todo_id: "",
            name: "",
            weight: 0,
            set: 0,
            created_at: "",
            clear_plan: ""
        }],
        completeTodos: [{
            todo_id: "",
            name: "",
            weight: 0,
            set: 0,
            created_at: "",
            clear_plan: "",
            clear_data: ""
        }],
        dataSet: [],
        dataLabel: [],
        lineData: {},
        training_name: "",
        isLoading: false,
        weightData: {},
        setData: {},
        base_url: process.env.VUE_APP_API_GATEWAY_BASE_URL
    }),
    computed: {
        isShowGraph: function() {
            if(Object.keys(this.weightData).length === 0){
                return false
            }else{
                return true
            }
        }
    },
    created() {
        //url
        const api_name = 'MuscleApi'
        const path     = '/todos'
        const user_info_storage_key = `CognitoIdentityServiceProvider.${process.env.VUE_APP_USER_POOL_WEB_CLIENT_ID}.LastAuthUser`
        const user_info = sessionStorage.getItem(`${user_info_storage_key}`)
        console.log
        // Todo一覧を取得
        AwsUtil.getAPI(api_name, `${path}/${user_info}`).then( (response) => {
            console.log(response.data)
            this.todos = response.data["not_complete"]
            this.completeTodos = response.data["complete"]
        }, (error) => {
            this.$store.commit('message/setMessage', {"message":"Todoの取得に失敗しました", "type":"error"}, {root: true})
        })
    },
   mounted() {
        //  Graph描画データを取得
        request.get(`${this.base_url}/api/v1/graph`, options).then( (response) => {
            // 円グラフ描画
            const graph_datasets = response.data["pie_data"]
            this.dataSet         = Object.values(graph_datasets)
            this.dataLabel       = Object.keys(graph_datasets)
            //this.$refs.graph.trimLabelData(this.dataSet, this.dataLabel)
            //折れ線グラフ描画
            this.lineData        = Object.assign({}, response.data["line_data"])
        }, (error) => {
            this.graphData = {}
        })
    }, 
    components: {
        "openDialog": Dialog,
        "taskRegisterForm": TaskRegisterForm,
        "myDataTable": DataTable,
        "taskCompleteForm": TaskCompleteForm,
        "MyPieGraph": PieChart,
        "myCompleteGraph": LineChart,
        "mySelectBox": SelectBox,
        "myWeightGraph": SetWeightLineChart
    },
    methods: {
        openDialog(){
            this.dialog = true
        },
        closeForm(){
            this.editIndex = -1
            this.todo      = {
                name: "",
                weight: "",
                set: "",
                complete_plan_date: new Date().toISOString().substr(0,10)
            }
            this.dialog         = false
            this.completeDialog = false
        },
        createDataTable(todos){
            this.todos = todos
        },
        appendTodo(todo){
            this.todos.push(todo)
        },
        updateTodo(todo){
            Object.assign(this.todos[this.editIndex], todo)
        },
        editForm(todoArgs){
            this.todo = Object.assign({}, todoArgs.todo)
            this.editIndex = todoArgs.index
            this.dialog = true
        },
        deleteConfirm(todoArgs){
            this.editIndex = todoArgs.index;
            this.todo      = Object.assign({}, todoArgs.todo)
            confirm("このTodoを削除します。よろしいですか?") && this.deleteTodo()
        },
        deleteTodo(){
            // Todoを削除
            const options  = {
                auth: true,
            }
            console.log(base_url)
            request.delete(`${base_url}/api/v1/todo/${this.todo.todo_id}`, options).then( (response) => {
                //データから削除
                this.todos.splice(this.editIndex, 1)
                this.$store.commit("message/setMessage", {"message": "削除しました"}, {root: true})
                this.close()
            }, (error) => {
                // responce code is 403
                if (error.response.status) {
                    this.$store.commit("message/setMessage", {"message": "不正な操作です。", "type": "error"}, {root: true})
                }
                else{
                    this.$store.commit("message/setMessage", {"message": "削除できませんでした。しばらくしてからやり直してください", "type":"error"}, {root: true})
                }
                this.closeForm()
            })
        },
        completeTodo(todoArgs){
            this.editIndex      = todoArgs.index;
            this.todo           = Object.assign({}, todoArgs.todo)
            this.completeDialog = true
        },
        afterComplete(todo){
            // Todo一覧から削除
            this.todos.splice(this.editIndex, 1)
            //グラフ描画用データに追加
            const todo_name    = todo.name
            const search_index = this.dataSet.findIndex(item => item == todo.name)
            const clear_date   = Date.new()
            // 既存のデータに存在しない場合
            if(search_index === -1){
                //　円グラフ
                this.dataLabel.push(todo_name)
                this.dataSet.push(1)
                // 折れ線グラフ
                this.lineData[clear_date] = 1
            // 既存のデータが存在する場合
            }else{
                //一致するデータラベルを探索
            }
            this.dataSet.push()
            this.closeForm()
        },
        getWeightSetLine(training_name){
            if (this.isLoading) return;
            this.weightData = {}
            this.setData = {}
            this.isLoading = true
            const url = '/api/v1/graph/search'
            const options = {
                params: {
                    name: training_name
                },
                auth: true
            }
            request.get(url, options).then( (response) => {
                this.weightData = response.data.weight_data
                this.setData    = response.data.set_data
                this.isLoading = false;
            }, (error) => {
                console.log(error)
            })

        }

    }
}
</script>

