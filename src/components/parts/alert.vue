<template>
    <div>
        <v-alert
            :value="getAlert"
            dismissible
            :color="type"
            :icon="iconType"
            v-if="getAlert"
            @click="clearMessage"
        >
            {{ message }}
        </v-alert>
    </div>
</template>
<script>
import store from "../../store/store"
export default {
    data: () => ({
        alert: false
    }),
    computed: {
        message() {
            return this.$store.state.message.message
        },
        type() {
            return this.$store.state.message.type
        },
        iconType() {
            if(this.$store.state.message.type === "success"){
                return "mdi-checkbox-marked-circle"
            }
            else if(this.$store.state.message.type === "error"){
                return "mdi-alert-box"
            }
        },
        getAlert() {
            if(this.$store.state.message.message){
                return true
            }
            else{
                return false
            }
        },
    },
    methods: {
        clearMessage: function(){
            this.$store.commit('message/clearMessage', {root: true})
        }
    }
}
</script>

