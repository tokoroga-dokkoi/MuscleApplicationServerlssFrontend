<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        datasets: {
            type: Object,
            required: false
        },
    },
    data: () => ({
        chartData: {
            labels: [],
            datasets: [{
                label: "",
                data: [],
                borderColor: ""
            }]
        },
        options: {
            title: {
                display: true,
                text: `推移`
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'liner',
                    time: {
                        displayFormat: 'YYYY-MM-DD'
                    },
                    ticks: {
                        source: 'data'
                    },
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
    created() {
        //labelを直近1ヶ月で設定
        const day_array       = []
        const start_today     = new Date()
        var   end_a_month_ago = new Date()
        end_a_month_ago.setMonth(end_a_month_ago.getMonth() - 1)
        //繰り返し
        for(var day = start_today; day < end_a_month_ago; day.setDate(day.getDate() + 1)){
            const format_date = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
            console.log(`this date is ${format_date}`)
            day_array.push(format_date)
        }
        this.chartData.labels = day_array
    },
    computed: {
        isDataEmpty: function(){
            if(Object.keys(this.datasets).length === 0){
                return true
            }
            else{
                return false
            }
        }
    },
    methods: {
        chartGraph(){
            console.log(`Data is ${this.isDataEmpty}`)
            if(this.isDataEmpty) return false
            for( const [key, value] of Object.entries(this.datasets) ) {
                const format_date = this.formatDate(key)
                if(value.weight){
                    this.chartData.datasets[0].data.push({
                        y: value.weight,
                        x: format_date
                    })
                    this.chartData.datasets[0].label = "重量"
                    this.options.title.text = "重量推移"
                }else{
                    this.chartData.datasets[0].data.push({
                        y: value.set,
                        x: format_date
                    })
                    this.chartData.datasets[0].label = "セット数"
                    this.options.title.text = "セット数推移"
                }
            }
            console.log(this.chartData)
            this.renderChart(this.chartData, this.options)
        },
        formatDate(non_format_date){
            const date = new Date(non_format_date.substr(0,10))
            return date.toISOString().substr(0,10)
        }
    },
    watch: {
        datasets: {
            immediate: true,
            handler: 'chartGraph'
        }
    }
}
</script>
