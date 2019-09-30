<template>
    <v-container>
        <h1>Timeline表示</h1>
        <div v-for="timeline in timelines" :key="timeline.id">
            <TweetPost :timeline="timeline"></TweetPost>
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
    }),
    created() {
        const url = '/timeline'
        // Timelineのデータを取得
        AwsUtil.getAPI('MuscleApi', url).then( response => {
            this.timelines = response.item
        })
    },
    components: {
        'TweetPost': TweetPost
    }
}
</script>