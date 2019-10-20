<template>
    <div>
        <v-dialog
            :value="dialog"
            persistent
            scrollable
            width="400"
            @input="closeDialog"
        >
            <slot name="content">Dialog</slot>
        </v-dialog>
    </div>
</template>
<script>
export default {
    props: ["dialog"],
    methods: {
        closeDialog(){
            this.$emit("close")
        }
    }
}
</script>

