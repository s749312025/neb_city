<template>
    <div class="home">
        <div class="top">
            <h1>城市的印象</h1>
            <div>
                不管你是喜欢一二线城市的繁华，还是钟情于故乡小村镇的安逸。你一定和这些或大或小的地方有着很多的故事，既然缘分让我们集聚于此，就和大家分享分享你与你的城市的故事吧。
            </div>
        </div>
        <div class="search text-center">
            <input type="text" v-model="cityName" placeholder="请输入城市名，如 上海、北京">
            <span class="input-go" @click="getComment(cityName)">去看看</span>
        </div>
        <div class="newCity" v-if="newestCity.length > 0">
            <span>最新添加城市：</span>
            <span class="city" v-for="(item, index) in newestCity" :key="index" @click="handleClickCity(item)">{{item}}</span>
        </div>
        <div class="selected" v-if="selected.length > 0">
            <span class="city">{{selected}}</span>
            <span class="story" @click="openComment">我有故事？</span>
        </div>
        <div class="comment">
            <ul v-if="result.length !== 0">
                <li class="item flex" v-for="(item, index) in result" :key="index">
                    <div class="name"><span class="normap" :title="item.name">{{item.name}}</span>:</div>
                    <div class="flex-1 content">
                        <p>{{item.content}}</p>
                        <p class="date">{{item.date}}</p>
                    </div>
                </li>
            </ul>
            <div v-else class="nodata">
                暂无此城市的故事
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="showcityModal"
            width="500px">
            <div class="modalMain">
                <p class="tip">
                    未查询到你输入的城市节点，来创建一个吧
                </p>
                <el-input placeholder="请输入城市名" style="width: 340px;" v-model="addCityName"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showcityModal = false">取 消</el-button>
                <el-button type="primary" @click="handleAddCity">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="showcommentModal"
            width="500px">
            <div class="modalMain">
                <p class="tip">
                    每个城市都给你留下来或多或少的回忆<br>来和我们分享一下吧
                </p>
                <div>
                    <el-input placeholder="请输入名字" v-model="addCommentForm.name"></el-input>
                </div>
                <div>
                    <el-input type="textarea" :rows="6" placeholder="请写下你的故事" v-model="addCommentForm.content"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showcommentModal = false">取 消</el-button>
                <el-button type="primary" @click="handleAddComment">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue'
import moment from 'moment'
import { setInterval } from 'timers';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
const isTest = 0; // 0 main 1 test
// const dappAddress = "n21ci7yfCJNKu9HkQUawmF7QdukW8hhJBKy";
// n1jBmwagVd961iH1H9qs1rwRDxytNLU9AFV main
const dappAddress = isTest === 1 ?  "n1fVGrzaGmfUCBDtHvooSeKX9ftjbxQg9Ek" : "n1jBmwagVd961iH1H9qs1rwRDxytNLU9AFV";
const nebulas = require("nebulas")
const Account = nebulas.Account
var neb = new nebulas.Neb()
neb.setRequest(new nebulas.HttpRequest(isTest === 1 ? "https://testnet.nebulas.io" : "https://mainnet.nebulas.io"))

export default {
    components: {
        SweetModal
    },
    data() {
        return {
            selected: '',
            cityName: '',
            start: 0,
            per: 5,
            serialNumber: undefined,
            intervalQuery: undefined,
            addCityName: '',
            showcityModal: false,
            showcommentModal: false,
            addCommentForm: {
                name: '',
                content: '',
                date: ''
            },
            newestCity: [],
            result: [],
            result1: [
                {
                    name: '霸王气',
                    reason: `南京给你一个姑娘，你就会爱上南京，上海给你一个姑娘，你就会爱上上海，城市没有什么好了解的，它给了你爱情，你才会真正的了解它。`,
                    date: '2018-03-19',
                },
                {
                    name: '霸王气',
                    reason: `南京给你一个姑娘，你就会爱上南京，上海给你一个姑娘，你就会爱上上海，城市没有什么好了解的，它给了你爱情，你才会真正的了解它。`,
                    date: '2018-03-19',
                },
                {
                    name: '霸王气123',
                    reason: `南京给你一个姑娘，你就会爱上南京，上海给你一个姑娘，你就会爱上上海，城市没有什么好了解的，它给了你爱情，你才会真正的了解它。`,
                    date: '2018-03-19',
                }
            ]
        }
    },
    methods: {
        getComment(city) {
            if(!city) {
                this.$message.error('请填写城市名！')
                return
            }
            var from = Account.NewAccount().getAddressString();
            var value = "0";
            var nonce = "0"
            var gas_price = "1000000"
            var gas_limit = "2000000"
            var callFunction = "getCityInfo";
            var callArgs = "[\"" + city + "\", \""+this.start + "\", \""+this.per + "\"]"; //in 
            var contract = {
                "function": callFunction,
                "args": callArgs
            }
            var charData = (data) => {
                var result = JSON.parse(data.result)
                console.log(result);
                if(!result || result.error) {
                    this.showcityModal = true
                    this.addCityName = city
                } else {
                    console.log(result.result.comments);
                    this.selected = city
                    this.result = result.result.comments
                    console.log(this.result);
                }
            }
            neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
                charData(resp)
            }).catch(function (err) {
                console.log("error:" + err.message)
            })
        },
        saveCity(city) {
            if(!city) {
                this.$message.error('请填写城市名！')
                return
            }
            var NebPay = require("nebpay")
            var nebPay = new NebPay();
            var to = dappAddress
            var value = "0";
            var callFunction = "saveCity";
            var callArgs = "[\"" + city + "\"]";
            var cb = () => {
                this.showcityModal = false
                this.$notify.info('正在同步到星云链')
                this.intervalQuery = window.setInterval(() => {
                    nebPay.queryPayInfo(this.serialNumber)
                    .then(res => {
                        var resObject = JSON.parse(res)
                        if(resObject.msg.indexOf('transaction error') > -1) {
                            window.clearInterval(this.intervalQuery)
                        }
                        if(resObject.code === 0 && resObject.data.status === 1){
                            window.clearInterval(this.intervalQuery)
                            this.getComment(city)
                            this.getNewestCity()
                            this.$message.success('添加城市成功')
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    })
                }, 5000)
            }
            this.serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                listener: cb        //设置listener, 处理交易返回信息
            });
        },
        handleAddCity() {
            if(!this.addCityName) {
                this.$message.error('请输入城市名')
                return
            }
            this.saveCity(this.addCityName)
        },
        handleClickCity(city) {
            this.cityName = city
            this.getComment(city)
        },
        handleAddComment() {
            var a = {
                code: 1,
                content: [{b: 2, c:3}, {b:4, c:5}]
            }
            var data = {
                name: this.addCommentForm.name,
                content: this.addCommentForm.content,
                date: moment().format('YYYY-MM-DD HH:mm')
            }
            var NebPay = require("nebpay")
            var nebPay = new NebPay();
            var to = dappAddress
            var value = "0";
            var callFunction = "saveCityComment";
            var callArgs = JSON.stringify([this.selected, data]);
            var cb = () => {
                this.showcommentModal = false
                this.$notify.info('正在同步到星云链')
                this.intervalQuery = window.setInterval(() => {
                    nebPay.queryPayInfo(this.serialNumber)
                    .then(res => {
                        var resObject = JSON.parse(res)
                        if(resObject.msg.indexOf('transaction error') > -1) {
                            window.clearInterval(this.intervalQuery)
                        }
                        if(resObject.code === 0 && resObject.data.status === 1){
                            window.clearInterval(this.intervalQuery)
                            this.getComment(this.selected)
                            //this.getNewestCity()
                            this.$message.success('添加故事成功')
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    })
                }, 5000)
            }
            //return
            this.serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                listener: cb        //设置listener, 处理交易返回信息
            });
        },
        openComment() {
            this.showcommentModal = true
        },
        getNewestCity() {
            var _newestCity 
            var from = Account.NewAccount().getAddressString();
            var value = "0";
            var nonce = "0"
            var gas_price = "1000000"
            var gas_limit = "2000000"
            var callFunction = "getNewestCity";
            var callArgs = "[]";
            var contract = {
                "function": callFunction,
                "args": callArgs
            }
            var change = (key, value) => {
                this[key] = value
                if(value && value.length > 0) {
                    this.cityName = '杭州'
                    this.getComment('杭州')
                }
            }
            neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
                const result = JSON.parse(resp.result)
                change('newestCity', result.result)
            }).catch(function (err) {
                console.log("error:" + err.message)
            })
        }
    },
    mounted() {
        this.getNewestCity()
    }
};
</script>

<style lang="scss" scoped>
.home {
    padding-top: 140px;
    .top {
        h1 {
            font-size: 36px;
            margin-bottom: 20px;
        }
        div {
            text-align: center;
            font-size: 20px;
            width: 830px;
            line-height: 32px;
            margin: 0 auto;
        }
    }
    .search {
        margin-top: 40px;
        input {
            background: transparent;
            border: 1px solid #ffffff70;
            width: 480px;
            height: 42px;
            padding: 0 30px;
            border-radius: 21px;
            outline: none;
            color: #eee;
            font-size: 15px;
        }
        .input-go {
            padding: 10px;
            margin-left: 10px;
            cursor: pointer;
        }
    }
    .newCity {
        max-width: 520px;
        margin: 10px auto 5px;
        span.city {
            text-decoration: underline;
            margin-right: 10px;
            cursor: pointer;
        }
    }
    .selected {
        span.city {
            display: inline-block;
            border: 1px solid #ffffff88;
            margin-top: 20px;
            padding: 0 10px;
            height: 30px;
            line-height: 30px;
        }
        span.story {
            margin-left: 15px;
            cursor: pointer;
        }
    }
    .comment {
        width: 666px;
        margin: 38px auto 50px;
        li + li {
            margin-top: 26px;
        }
        .name {
            width: 110px;
            text-align: right;
            .normap {
                display: inline-block;
                overflow: hidden;
                width: 94px;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: middle;
            }
        }
        .content {
            margin-left: 10px;
            text-align: left;
            position: relative;
            .date {
                padding-right: 10px;
                margin-top: 10px;
                text-align: right;
            }
        }
    }
    .modalMain {
        p.tip {
            font-size: 18px;
            margin-bottom: 20px;
        }
        input {
            width: 340px;
            padding: 0 12px;
            height: 30px;
            outline: none;
            border-radius: 3px;
            border: 1px solid #ddd;
        }
    }
}
</style>

<style lang="scss">
.home {
    textarea {
        margin-top: 20px;
        resize: none;
    }
    .sweet-modal {
        color: #666;
        h2 {
            color: #666;   
        }
        button.btn {
            color: #12acff;
            border: 1px solid #ddd;
            padding: 5px 10px;
            border-radius: 3px;
            outline: none;
            cursor: pointer;
        }
    }
}
</style>
