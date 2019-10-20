<template>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
    >
        <template v-slot:item.clear_plan="{item}">
            <v-list>
                <v-list-group
                    v-model="item.active"
                    no-action
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.clear_plan"></v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="menu in item.menu"
                        :key="menu.name"
                    >
                        <v-list-item-content>
                            <v-list-item-title v-text="menu.name"></v-list-item-title>
                            <v-list-item-title v-text="createMenuText(menu)"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </template>
        <template v-slot:item.action="{item}">
            <v-icon
                size="20"
                class="mr-2"
                @click="completeItem(item)"
            >
                mdi-clipboard-check
            </v-icon>
            <v-icon
                size="20"
                class="mr-2"
                @click="editItem(item)"
            >
                mdi-tooltip-edit
            </v-icon>
            <v-icon
                size="20"
                class="mr-2"
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
    </v-data-table>
</template>
<script>
export default {
    props: {
        headers: Array,
        todos: Array
    },
    data: () => ({
        items: []
    }),
    methods: {
        createMenuText: function(menu){
            const text = `${menu.weight}KG×${menu.set}セット`
            return text
        },
        editItem: function(item){
            const index = this.items.indexOf(item)
            let edit_item   = Object.assign({}, this.todos[index])
            this.$emit("edit", {"todo": edit_item, "index": index})
        },
        updateItem: function(index, item){
            /*
             データテーブルを更新するメソッド
            */
            //データを削除
            this.items.splice(index,1)
            //日付のフォーマット
            item.clear_plan  = this.dateFormat(item.clear_plan)
            item.clreated_at = this.dateFormat(item.created_at)
            item.active      = false
            item.menu_num    = item.menu.length
            //データを登録
            this.items.splice(index, 0, item)
            console.log(this.items[index])
        },
        deleteItem: function(item){
            const index = this.items.indexOf(item)
            this.$emit("delete", {"todo":item, "index": index})
        },
        completeItem: function(item){
            // tableの配置番号を追加
            const index         = this.items.indexOf(item)
            this.$emit("complete", {"todo": item, "index": index})
        },
        convertDateFormat(){
            this.items = []
            for(let i = 0; i < this.todos.length; i++){
                const non_format_clear_date  = this.todos[i]["clear_plan"]
                const non_format_create_date = this.todos[i]["created_at"]
                const item = Object.assign({}, this.todos[i])
                item["clear_plan"] = this.dateFormat(non_format_clear_date)
                item["created_at"] = this.dateFormat(non_format_create_date)
                item["active"]     = false
                item["menu_num"]   = item.menu.length
                this.items.push(item)
            }
        },
        dateFormat(non_format_date){
            const date = new Date(non_format_date)
            return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
        },
        deleteRows(index){
            
        }
    },
    watch: {
        todos: {
            immediate: true,
            handler: 'convertDateFormat'
        }
    }
}
</script>

