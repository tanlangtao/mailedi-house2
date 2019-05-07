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

    @property
    public data = null;
    public app = null;

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    

    }

    public init(data){
        this.data = data;
        //上架时间
        this.created_atLabel.string =  this.app.config.getTime(data.created_at);
        // 上架金币
        this.goldLabel.string = this.app.config.toDecimal(data.gold);
        //剩余金币
        this.last_goldLabel.string = this.app.config.toDecimal(data.last_gold);
        // 兑换单价
        this.exchange_priceLabel.string = this.app.config.toDecimal(data.exchange_price);
        //最低兑换数量
        this.min_goldLabel.string = this.app.config.toDecimal(data.exchange_price);
        // 兑换方式
        let pay_account = JSON.stringify(data.pay_account);
        console.log(pay_account);
        //状态
        this.statusLabel.string = data.status == 1|| data.status == 2 ? '审核中'
            : (data.status == 4 ?'挂单中' :(data.status == 6?'已下架':'已拒绝'));
        //备注

        this.RemarksLabel.string = ''

    }

    start () {

    }

    onClick(){

    }
    // update (dt) {}
}
