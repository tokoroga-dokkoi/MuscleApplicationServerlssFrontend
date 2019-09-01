<template>
    <div>
        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable
        >
            <v-card tile>
                <v-toolbar fixed card dark color="indigo darken-4">
                    <v-btn icon dark @click="closeDialog">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>アプリケーションの機能紹介</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-container fluid grid-list-md pa-2>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card>
                                <v-img
                                :src="image1"
                                class="white--text"
                                height="400px"
                                >
                                    <v-card-title
                                        class="fill-height align-end"
                                    >
                                        <h4>メニューのToDo管理</h4>
                                    </v-card-title>
                                </v-img>
                                <v-card-text>
                                    <p>トレーニングの内容をToDo管理します</p>
                                    <p>トレーニングにはコメントをつけて登録が可能です</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs12>
                            <v-card>
                                <v-img
                                :src="image1"
                                class="white--text"
                                height="400px"
                                >
                                    <v-card-title
                                        class="fill-height align-end"
                                    >
                                        <h4>過去のトレーニング実績を可視化</h4>
                                    </v-card-title>
                                </v-img>
                                <v-card-text>
                                    <p>過去行なったトレーニングの重量やセット数をグラフで可視化します</p>
                                    <p>トレーニングを振り返ることで筋トレのモチベーションをあげることができます</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs12>
                               <v-card>
                                <v-img
                                :src="image1"
                                class="white--text"
                                height="400px"
                                >
                                    <v-card-title
                                        class="fill-height align-end"
                                    >
                                        <h4>タイムラインの投稿　</h4>
                                    </v-card-title>
                                </v-img>
                                <v-card-text>
                                    <p>トレーニングを他の人に共有することができます</p>
                                    <p>また、周りの人のトレーニング実績をみることができます</p>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    data: () => ({
        image1: require("../../assets/hero.jpg")
    }),
    props: ['dialog'],
    methods: {
        closeDialog() {
            this.$parent.dialog = false
        }
    }
}
</script>

