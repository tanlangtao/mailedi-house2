// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    startTimeLabel: cc.Label = null;

    @property(cc.Label)
    startGoldLabel: cc.Label = null;

    @property(cc.Label)
    remainderGoldLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Label)
    sillLabel: cc.Label = null;

    @property(cc.Node)
    pay_accountNode: cc.Node = null;

    @property(cc.Label)
    averageTimeLabel: cc.Label = null;

    @property
    public data = null;
    public parentComponent = null;
    public app = null;
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    public init(data){
        this.data = data;
        this.startTimeLabel.string = this.app.config.getTime(data.up_at);
        this.startGoldLabel.string = `${parseInt(data.gold)}`;
        this.remainderGoldLabel.string = `${parseInt(data.last_gold)}`;
        this.priceLabel.string = this.app.config.toDecimal(data.exchange_price);
        this.sillLabel.string = `${parseInt(data.min_gold)}`;
        // 兑换方式
        let pay_account = JSON.parse(data.pay_account);
        pay_account.forEach((item,index)=>{
            if(item.type == 2){
                this.app.loadIcon('/zfbIcon',this.pay_accountNode)
            }else if(item.type == 3){
                this.app.loadIcon('/bankIcon',this.pay_accountNode)
            }
        });
        this.averageTimeLabel.string = data.average_complete_time == 0 ? '无' :`${this.app.config.getTime2(data.average_complete_time)}`;
    }

    onClick(){
        // 点击交易
        if(this.app.accountInfo.data.has_account == 0){
            this.app.showAlert('请先到收付款账号界面添加收付款方式！')
        }else{
            if(this.data.user_id == this.app.UrlData.user_id){
                this.app.showAlert('不能与自己交易！')
            }else{
                this.app.showWriteGoldAlert(this.data);
            }
        }


    }
    // update (dt) {}
}
