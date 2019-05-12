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

    @property(cc.Node)
    accNumList: cc.Node = null;

    @property(cc.Prefab)
    accNumItem : cc.Prefab = null;

    @property
    public results = null;
    public app = null;
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.fetchIndex()
    }

    public fetchIndex() {

        let url = `${this.app.UrlData.host}/api/payment_account/accountInfo?user_id=${this.app.UrlData.user_id}&token=${this.app.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            this.accNumList.removeAllChildren();
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {
                this.app.showAlert(data.msg)
            }
        })
    }
    init(){
        for(let i = 0 ;i < this.results.data.list.length ;i++){
            let data = this.results.data.list[i];
            let node = cc.instantiate(this.accNumItem);
            this.accNumList.addChild(node);
            node.getComponent('AccNumItem').init(data);
        }
    }

    giveClick(){
        this.app.showGive();
        this.node.removeFromParent();
    }

    showMainClick(){
        this.app.showMain();
        this.node.removeFromParent();
    }

    addClick(){
        if(this.app.accountInfo.data.list.length >=8){
            this.app.showAlert('收付款账户已达上限，请选择修改或删除！')
        }else{
            this.app.showAddTypeAlert()
        }

    }
    // update (dt) {}
}
