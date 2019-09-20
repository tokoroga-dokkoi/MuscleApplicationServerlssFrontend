<template>
    <div>
        <v-alert
            :value="getAlert"
            dismissible
            :color="type"
            :icon="iconType"
            v-model="alert"
        >
            {{ getAlert }}
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
            console.log(this.$store.getters['message/getMessage'])
            return this.$store.getters['message/getMessage']
        },
    },
    methods: {
        clearMessage: function(){
            this.$store.dispatch('message/clearMessage', {root: true})
            this.alert=false
        }
    },
    watch: {
        getAlert (val, old){
            this.alert = !val ? false: true
        },
        alert (val, old){
            if(!val){
                this.$store.commit('message/clearMessage', {root: true})
            }
        }
    }
}
</script>

