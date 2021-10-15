import axios from 'axios'

const SERVER_URL = 'http://localhost:3001';
const instancia = axios.create({
    baseURL: SERVER_URL,
    timeout: 5000
})

export default{
    async execute(method, resource, data, config){
        return instancia({
            method: method,
            url: resource,
            data,
            headers: {
                //Authorization: localStorage.getItem('token') === null?'':'Bearer '+localStorage.getItem('token')
            },
            config,
        })
    },
    doPost(endPoint, object){ // response
        return this.execute('POST', endPoint, object)
    },
    // doGet(endPoint){ // response.data
    //     return this.execute('GET', endPoint, null, {
    //         transformResponse: [function(data){
    //             return data;
    //         }]
    //     });
    // },
    doGet(endPoint){ // resonse
        return this.execute('GET',endPoint)
    },
    doPut(endPoint, object){ // response
        return this.execute('PUT', endPoint, object)
    },
    doDelete(endPoint){ // response
        return this.execute('DELETE',endPoint)
    }
}