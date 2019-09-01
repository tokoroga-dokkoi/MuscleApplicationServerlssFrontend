import axios from 'axios'
export default {
    // 汎用リクエスト
    request(method, url, options){

        var promise = null;
        var params  = {};
        var headers = {};

        // optionのセット
        if(options.params){
            params = options.params;
        }
        //headerのセット
        if(options.headers){
            headers = options.headers;
        }
        // get以外のリクエスト
         if(method !== "get"){
            promise = axios({
                method: method,
                url: url,
                data: params,
                headers: headers
            })
        //getリクエスト
        }else {
            promise = axios({
                method: method,
                url: url,
                params: params,
                headers: headers
            })
        }
        return promise;
    },
    //Getメソッド
    get(url, options){
        return this.request('get', url, options);
    },
    //Postメソッド
    post(url, options){
        return this.request('post', url, options)
    },
    //PATCHメソッド
    patch(url, options){
        return this.request('patch', url, options)
    },
    //DELETEメソッド
    delete(url, options){
        return this.request('delete', url, options)
    }
}