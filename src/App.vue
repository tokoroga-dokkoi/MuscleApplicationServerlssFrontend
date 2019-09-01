<template>
  <v-app>
    <MyHeader />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import MyHeader   from './components/globals/header'
import MyAlert    from './components/parts/alert'
export default {
  name: 'App',
  components: {
    MyHeader,
    MyAlert
  },
  data: () => ({
    //
  }),
};
</script>
