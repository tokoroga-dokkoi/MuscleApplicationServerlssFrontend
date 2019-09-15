<template>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
    >
        <template v-slot:items="props">
            <td> {{props.item.name}} </td>
            <td class="text-xs-right">{{props.item.weight}}</td>
            <td class="text-xs-right">{{props.item.set}}</td>
            <td class="text-xs-right">{{props.item.created_at}}</td>
            <td class="text-xs-right">{{props.item.clear_plan}}</td>
            <td>
                <v-icon
                    small
                    class="mr-2"
                    @click="completeItem(props.item)"
                >
                    mdi-clipboard-check
                </v-icon>
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                >
                    mdi-tooltip-edit
                </v-icon>
                <v-icon
                    small
                    class="mr-2"
                    @click="deleteItem(props.item)"
                >
                    mdi-delete
                </v-icon>
            </td>
        </template>
        <div>
            <v-icon>
                mdi-home
            </v-icon>
        </div>
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
            const index = this.items.indexOf(item)
            this.$emit("complete", {"todo":item, "index": index})
        },
        convertDateFormat(){
            for(let i = this.items.length; i < this.todos.length; i++){
                const non_format_clear_date  = parseInt(this.todos[i]["clear_plan"],10)
                const non_format_create_date = parseInt(this.todos[i]["created_at"],10)
                const item = Object.assign({}, this.todos[i])
                item["clear_plan"] = this.dateFormat(non_format_clear_date)
                item["created_at"] = this.dateFormat(non_format_create_date)
                this.items.push(item)
            }
        },
        dateFormat(non_format_date){
            const date = new Date(non_format_date * 1000)
            return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
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

