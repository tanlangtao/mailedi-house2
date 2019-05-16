// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import scaleTo = cc.scaleTo;

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    label : cc.Label = null;

    @property()
    FormData = new FormData();
    public app = null;
    public action = null;
    public data = null;

    public init(data){
        this.data = data;
        this.label.string = `上一笔订单未完成(金额:${parseInt(data.gold)})，确认撤销上一笔订单，重新交易？`
    }

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');

    }

    onClick(){
        this.fetchCancle();
        this.node.removeFromParent();
    }

    fetchCancle(){
        let url = `${this.app.UrlData.host}/api/trading_order/cancelOrder`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('order_id', this.data.order_id);
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                // 刷新app数据
                this.app.fetchIndex();

                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
