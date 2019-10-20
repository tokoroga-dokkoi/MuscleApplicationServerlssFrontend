<template>
    <v-container>
        <h1>Timeline表示</h1>
        <div v-for="timeline in timelines" :key="timeline.id" class="mb-2">
            <TweetPost :timeline="timeline" :dialog="dialog" @change="changeDialogStatus()" @follow="followUser($event, timeline)" @unfollow="unfollowUser($event, timeline)"></TweetPost>
        </div>
    </v-container>
</template>
<script>
import TweetPost from '../parts/tweet_card.vue'
import store from '../../store/store'
import * as AwsUtil from '../../utils/AwsUtil'
export default {
    data: () => ({
        timelines: [],
        timeline: {},
        dialog: false
    }),
    created() {
        const url = '/timeline'
        // Timelineのデータを取得
        AwsUtil.getAPI('MuscleApi', url).then( response => {
            this.timelines = response.item
        })
    },
    methods: {
        followUser(timeline){
            this.dialog = true
            // パラメータを整形
            const params = {
                "following_name": timeline.user_name
            }
            const path   = "/relation"
            // 処理結果格納
            let update_timelines = []
            AwsUtil.postAPI('',path, params).then( (response) => {
                // 関連するユーザのタイムラインを取得
                update_timelines  = this.timelines.map( (val, index, array) => {
                    //follow番号を更新
                    if(val.user_name == timeline.user_name){
                        val.relation_id = response.item.id
                    }
                    return val
                })
            },(error) => {
                this.dialog=false
                console.log(error)
            }).then( (response) => {
                this.timelines = Object.assign({}, update_timelines)
                this.dialog = false
            }).catch( (error) => {
                console.log(error)
                this.dialog = false
            })
        },
        unfollowUser(timeline){
            const path = `/relation/${timeline.relation_id}`
            let update_timelines = []
            AwsUtil.deleteAPI(path).then( (response) => {
                //タイムラインのデータを更新する
                update_timelines = this.timelines.map( (val, index, array) => {
                    if(val.user_name === timeline.user_name){
                        val.relation_id    = -99
                    }
                    return val
                })
            }, (error) => {
                this.dialog=false
                console.error(error)
            }).then( (response) => {
                this.timelines = Object.assign({}, update_timelines)
                this.dialog = false
            }).catch( (error) => {
                this.dialog = false
            })
        },
        changeDialogStatus(){
            if(!this.dialog){
                this.dialog=true
            }
        }
    },
    components: {
        'TweetPost': TweetPost
    }
}
</script>