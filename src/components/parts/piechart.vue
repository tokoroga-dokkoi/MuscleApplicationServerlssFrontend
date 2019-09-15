<script>
import { Pie } from 'vue-chartjs'
import request from '../../utils/request'
export default {
    extends: Pie,
    props: {
        dataset: {
            type:Object,
            require: false,
        }
    },
    data: () => ({
        chartData: {
            labels: [],
            datasets: [{
                backgroundColor: [
                ],
                data:[]
            }]
        },
        options: {
            title:{
                display: 'true',
                text: 'トレーニングメニュー内訳',
                maintainAspectRatio: false
            }
        }
    }),
    methods: {
        Chart(){
            this.renderChart(this.chartData, this.options)
        },
        chartGraph(){
            //データがなければ処理停止
            if(!Object.keys(this.dataset).length){
                return true
            }
            this.chartData.labels = Object.keys(this.dataset)
            this.chartData.datasets[0].data   = Object.values(this.dataset)
            //create background color
            const backgroundColorArray = []
            for (let i=0; i < this.chartData.labels.length; i++){
                backgroundColorArray.push(this.calcBackGroundColor())
            }
            this.chartData.datasets[0].backgroundColor = backgroundColorArray
            this.renderChart(this.chartData, this.options)
        },
        calcBackGroundColor(){
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            let a = Math.random() * 1;
            return `rgba(${r},${g},${b},${a})`

        }
    },
    watch: {
        dataset: {
            immediate: true,
            handler: 'chartGraph'
        }
    }
}
</script>
