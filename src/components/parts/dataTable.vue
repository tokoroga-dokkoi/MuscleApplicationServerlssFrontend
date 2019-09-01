<template>
    <div>
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
                <td class="justify-center layout px-0">
                    <v-icon
                        small
                        class="mr-2"
                        @click="completeItem(props.item)"
                    >
                        done
                    </v-icon>
                    <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                    >
                    edit
                    </v-icon>
                    <v-icon
                        small
                        class="mr-2"
                        @click="deleteItem(props.item)"
                    >
                    delete
                    </v-icon>
                </td>
            </template>
        </v-data-table>
    </div>
</template>
<script>
export default {
    props: {
        headers: Array,
        items: Array
    },
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
            for(let i = 0; i < this.items.length; i++){
                const non_format_clear_date  = parseInt(this.items[i]["clear_plan"],10)
                this.items[i]["clear_plan"]  = this.dateFormat(non_format_clear_date)
                const non_format_create_date = parseInt(this.items[i]["created_at"],10)
                this.items[i]["created_at"]  = this.dateFormat(non_format_create_date)
                console.log(this.items[i])
            }
        },
        dateFormat(non_format_date){
            const date = new Date(non_format_date * 1000)
            return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
        }
    },
    watch: {
        items: {
            immediate: true,
            handler: 'convertDateFormat'
        }
    }
}
</script>

