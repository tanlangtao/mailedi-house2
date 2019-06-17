// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../lib/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    created_atLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Label)
    last_goldLabel: cc.Label = null;

    @property(cc.Label)
    exchange_priceLabel: cc.Label = null;

    @property(cc.Label)
    min_goldLabel: cc.Label = null;

    @property(cc.Node)
    pay_accountNode: cc.Node = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property(cc.Label)
    RemarksLabel: cc.Label = null;

    @property(cc.Node)
    btn: cc.Node = null;

    @property
    FormData = new FormData();
    public data = null;
    public app = null;

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.btn.active = false;

    }

    public init(data){
        this.data = data;
        //上架时间
        this.created_atLabel.string = data.up_at == 0 ? '无' : this.app.config.getTime(data.up_at);
        // 上架金币
        this.goldLabel.string = data.gold ? `${parseInt(data.gold)}` :'0';
        //剩余金币
        this.last_goldLabel.string = data.last_gold ? `${parseInt(data.last_gold)}` :'0';
        // 兑换单价
        console.log(data.exchange_price)
        this.exchange_priceLabel.string = this.app.config.toDecimal3(data.exchange_price);
        //最低兑换数量
        this.min_goldLabel.string = data.min_gold ? `${parseInt(data.min_gold)}` :'0';
        // 兑换方式
        let pay_account = JSON.parse(data.pay_account);
        pay_account.forEach((item,index)=>{
            if(item.type == 2){
                this.app.loadIcon('/zfbIcon',this.pay_accountNode)
            }else if(item.type == 3){
                this.app.loadIcon('/bankIcon',this.pay_accountNode)
            }
        })
        //状态
        this.statusLabel.string = data.status == 1|| data.status == 2 ? '审核中'
            : (data.status == 4 ?'已上架' :'已下架');
        //备注
        this.RemarksLabel.string = data.user_remark ?data.user_remark :'';

        data.status == 4 ? this.btn.active = true : '';

    }

    onClick(){
        this.fetchDownSellGold();
    }

    // 下架
    fetchDownSellGold(){
        let SellHistory = cc.find('Canvas/SellHistory').getComponent('SellHistory');

        let url = `${this.app.UrlData.host}/api/sell_gold/downSellGold`;
        this.FormData= new FormData();
        this.FormData.append('id',this.data.id);
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //刷新界面
                SellHistory.fetchIndex();
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
}
