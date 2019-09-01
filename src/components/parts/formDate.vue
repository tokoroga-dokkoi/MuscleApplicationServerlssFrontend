<template>
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        :return-value.sync="date"
        offset-y
        full-width
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="date"
                :label="label"
                prepend-icon="event"
                readonly
                v-on="on"
            >
            </v-text-field>
        </template>
        <v-date-picker v-model="date" scrollable @input="updateValue">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cansel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
    </v-menu>
</template>
<script>
export default {
    props: ["value", "label"],
    data: () => ({
        menu: false,
        date: new Date().toISOString().substr(0,10)
    }),
    methods: {
        updateValue: function(e) {
            this.$emit("input", this.date)
        }
    }
}
</script>
