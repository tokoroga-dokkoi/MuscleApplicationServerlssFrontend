<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        dataset: {
            type: Object,
            require: false,
        }
    },
    data: () => ({
        chartData: {
            labels: [],
            datasets: [
                {
                    label:"ToDo完了数",
                    data: [],
                    borderColor: "",

                }
            ],
        },
        options: {
            title: {
                display: true,
                text: "Todo数推移"
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'liner',
                    time: {
                        displayFormat: "YYYY-MM-DD"
                    },
                    ticks: {
                        source: 'data'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0
                    }
                }]
            }
        }
    }),
    computed: {
        isDataEmpty: function() {
            if(Object.keys(this.dataset).length === 0){
                return true
            }else{
                return false
            }
        }
    },
    created() {
        //labelを直近1ヶ月で設定
        const day_array       = []
        const start_today     = new Date()
        var   end_a_month_ago = new Date()
        end_a_month_ago.setMonth(end_a_month_ago.getMonth() - 1)
        //繰り返し
        for(var day = start_today; day < end_a_month_ago; day.setDate(day.getDate() + 1)){
            const format_date = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
            day_array.push(format_date)
        }
        this.chartData.labels = day_array
    },
    methods: {
        chartGraph(){
            //時系列データの生成
            if(this.isDataEmpty) return false;
            for( const [key, value] of Object.entries(this.dataset) ){
                const format_date = this.formatDate(key)
                this.chartData.datasets[0].data.push({
                    y: value,
                    x: format_date
                })
            }
            this.renderChart(this.chartData, this.options)
        },
        formatDate(non_format_date){
            const date = new Date(non_format_date.substr(0,10))
            return date.toISOString()
        }
    },
    watch: {
        dataset:{
            immediate: true,
            handler: 'chartGraph'
        }
    }
}
</script>
