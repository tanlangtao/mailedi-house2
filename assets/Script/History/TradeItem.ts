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
    typeLabel: cc.Label = null;

    @property(cc.Label)
    order_idLabel: cc.Label = null;

    @property(cc.Label)
    user_idLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Label)
    arrival_amountLabel: cc.Label = null;

    @property(cc.Label)
    created_atLabel: cc.Label = null;

    @property(cc.Label)
    arrival_atLabel: cc.Label = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    @property
    FormData = new FormData();
    public data = null;
    public app = null;

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    public init(data){
        this.data = data;
        this.typeLabel.string = data.user_id ==this.app.UrlData.user_id ? '买入' :'卖出';
        this.order_idLabel.string = data.order_id.slice(-6);
        //交易ID，显示对方的ID;
        this.user_idLabel.string = data.user_id == this.app.UrlData.user_id ? data.replace_id:data.user_id;
        this.goldLabel.string = this.app.config.toDecimal(data.gold);
        this.arrival_amountLabel.string = this.app.config.toDecimal(data.arrival_amount);
        this.created_atLabel.string = this.app.config.getTime(data.created_at);
        this.arrival_atLabel.string =data.arrival_at == 0 ? '无' : this.app.config.getTime(data.arrival_at);
        this.statusLabel.string = data.status == 1 ? "未支付"
            :(data.status == 2 ? '已过期'
                :(data.status == 4 ? '已撤销'
                    :(data.status == 5 ?'已支付' :(data.status == 6 ? "'已完成'" :'无效订单')))) ;

    }
}
