<template>
    <v-text-field
        :value="model"
        :rules="rules"
        :label="label"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off' "
        :type="show ? 'text' : 'password'"
        required
        @click:append="show = !show"
        @input="updateValue"
    >
    </v-text-field>
</template>
<script>
export default {
    data: () => ({
        show: false,
    }),
    props: ["model", "rules", "counter", "label"],
    methods: {
        updateValue: function(e){
            this.$emit("input", e);
        }
    }
}
</script>
