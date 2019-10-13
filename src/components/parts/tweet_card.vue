<template>
    <v-card>
        <v-card-title>
            <v-icon
                large
                left
            >
                mdi-twitter
            </v-icon>
            <span class="title font-weight-light">トレーニング記録</span>
        </v-card-title>
        <v-card-text>
            <div class="headline font-weight-bold">
                {{ timeline.comment }}
            </div>
        </v-card-text>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-run</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                メニュー名
            </v-list-item-title>
            <v-list-item-subtitle>
                {{ timeline.name}}
            </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-weight-kilogram</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                重量
            </v-list-item-title>
            <v-list-item-subtitle>
                {{ timeline.weight }}
            </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
            <v-list-item-icon>
                <v-icon>mdi-numeric</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
                セット数
            </v-list-item-title>
            <v-list-item-subtitle>
                {{ timeline.set }}
            </v-list-item-subtitle>
        </v-list-item>
        <v-card-actions>
            <v-list-item class="grow">
                <v-list-item-content>
                    <v-list-item-title>{{ timeline.user_name }}</v-list-item-title>
                </v-list-item-content>
                <v-row
                    align="center"
                    justify="end"
                >
                    <v-icon class="mr-1">mdi-heart</v-icon>
                    <span class="subheading mr-2">{{ timeline.favo }}</span>
                    <div class="following-action" v-if="!isOwnTweet">
                        <v-icon class="mr-1" v-if="timeline.relation_id > 0" @click="unfollow(timeline)">mdi-account-minus</v-icon>
                        <v-icon class="mr-1" v-else @click="follow(timeline)">mdi-account-plus</v-icon>
                        <v-dialog
                            v-model="dialog"
                            hide-overlay
                            persistent
                            width="300"
                        >
                            <v-card
                                color="primary"
                                dark
                            >
                                <v-card-text>
                                    フォロー処理中
                                    <v-progress-linear
                                        indeterminate
                                        color="white"
                                        class="mb-0"
                                    >
                                    </v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </div>
                </v-row>
            </v-list-item>
        </v-card-actions>
    </v-card>
</template>

<script>
import store from '../../store/store'
export default {
    data: () => ({
        user_name: ''
    }),
    props: {
        timeline: {
            type: Object,
            default: null
        },
        dialog: {
            Type: Boolean,
            default: false
        }
    },
    computed: {
        isOwnTweet: function() {
            let user_name = this.$store.state.session.user_name
            console.log(user_name)
            if(!user_name) {
                console.log("Not found user_name in store")
                this.$store.dispatch('session/setUserInfo', {root: true})
                user_name = this.$store.state.session.user_name
                console.log(user_name)
            }
            return user_name === this.timeline.user_name
        }
    },
    methods: {
        follow(timeline) {
            this.$emit('change')
            this.$emit('follow', timeline)
        },
        unfollow(timeline) {
            this.$emit('change')
            this.$emit('unfollow', timeline)
        }
    }
}
</script>