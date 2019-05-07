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
    label: cc.Label = null;

    @property()
    FormData = new FormData();
    public  app = null;
    public results = null;
    public init(data){
        this.label.string = data.text;
        this.results = data.results
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    start () {

    }

    onClick(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');

        let url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        this.FormData= new FormData();
        this.FormData.append('id',this.results.id);
        this.FormData.append('action','del');
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //刷新界面
                accNum.fetchIndex();
                this.app.fetchIndex();
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
        this.node.removeFromParent();
    }

    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
