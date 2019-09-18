<script>
import { Line } from 'vue-chartjs'
import * as moment from 'moment'
export default {
    extends: Line,
    props: {
        dataset: {
            type: Object,
            require: false,
        },
        label: {
            Type: String,
            require: false,
        },
        graphtitle: {
            Type: String,
            require: false
        }
    },
    data: () => ({
        chartData: {
            labels: [],
            datasets: [
                {
                    label: '',
                    data: [],
                    borderColor: "",

                }
            ],
        },
        options: {
            title: {
                display: true,
                text: ''
            },
            scales: {
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
            if(typeof this.dataset === 'undefined'){
                return true
            }
            if(Object.keys(this.dataset).length === 0){
                return true
            }else{
                return false
            }
        }
    },
    mounted() {
        //labelを直近1ヶ月で設定
        const day_array = []
        const today     = new Date()
        let   start_day = new Date()
        start_day.setMonth(today.getMonth() - 1)
        //繰り返し
        for(let day = start_day; day < today; day.setDate(day.getDate() + 1)){
            const format_date = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
            day_array.push(format_date)
        }
        this.chartData.labels = day_array
    },
    methods: {
        chartGraph(){
            //時系列データの生成
            if(this.isDataEmpty) return false;
            this.chartData.datasets[0].data = []
            // データのソート
            const sortedDatasets = this.sortObjectByKey()
            for( let data of sortedDatasets ){
                const format_date = this.formatDate(data["date"])
                this.chartData.datasets[0].data.push({
                    y: data["num"],
                    x: format_date
                })
            }
            this.chartData.datasets[0].label = this.label
            this.chartData.datasets[0].borderColor = this.calcBorderColor()
            this.options.title.text = this.graphtitle
            this.renderChart(this.chartData, this.options)
        },
        sortObjectByKey(){
            let keyArray = Object.keys(this.dataset)
            keyArray.sort()
            const sortedObject = keyArray.map(key => {
                return {
                    date: key,
                    num: this.dataset[key]
                }
            })

            return sortedObject
        },
        calcBorderColor(){
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            let a = Math.random() * 1;
            return `rgba(${r},${g},${b},${a})`

        },
        formatDate(non_format_date){
            const date    = new Date(non_format_date)
            const dateISO = moment(date.toISOString()).format('YYYY-MM-DD')
            return dateISO
            console.log(dateISO)
            //return date.toISOString().format()
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
