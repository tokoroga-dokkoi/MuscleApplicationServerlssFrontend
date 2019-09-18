<template>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
    >
        <template v-slot:body="{items}">
            <tbody v-if="items.length > 0">
                <tr v-for="item in items" :key="item.id">
                    <td class="text-xs-right"> {{ item.name }} </td>
                    <td class="text-xs-right"> {{ item.set }} </td>
                    <td class="text-xs-right"> {{ item.weight }} </td>
                    <td class="text-xs-right"> {{ item.created_at}}</td>
                    <td class="text-xs-right"> {{ item.clear_plan}}</td>
                    <td class="justify-center layout px-0" v-if="item.name">
                        <v-icon
                            small
                            class="mr-2"
                            @click="completeItem(item)"
                        >
                            mdi-clipboard-check
                        </v-icon>
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                        >
                            mdi-tooltip-edit
                        </v-icon>
                        <v-icon
                            small
                            class="mr-2"
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </td>
                </tr>
            </tbody>
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
        editItem: function(item){
            const index = this.items.indexOf(item)
            this.$emit("edit", {"todo": item, "index": index})
        },
        deleteItem: function(item){
            const index = this.items.indexOf(item)
            this.$emit("delete", {"todo":item, "index": index})
        },
        completeItem: function(item){
            // tableの配置番号を追加
            const index         = this.items.indexOf(item)
            this.$emit("complete", {"todo":item, "index": index})
        },
        convertDateFormat(){
            this.items = []
            for(let i = 0; i < this.todos.length; i++){
                const non_format_clear_date  = this.todos[i]["clear_plan"]
                const non_format_create_date = this.todos[i]["created_at"]
                const item = Object.assign({}, this.todos[i])
                item["clear_plan"] = this.dateFormat(non_format_clear_date)
                item["created_at"] = this.dateFormat(non_format_create_date)
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

