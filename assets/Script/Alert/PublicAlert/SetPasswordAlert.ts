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
    passwordLabel : cc.Label = null;

    @property()
    public app  = null;
    FormData = new FormData();
    parentComponent  = null;
    showSelect = false;

    public init(data){

        this.parentComponent = data.parentComponent;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    
    //Label点击回调
    inputClick(){
        this.app.showKeyBoard(this.passwordLabel,4);
    }

    onClick(){
        if(this.passwordLabel.string == '点击输入' ){
            this.app.showAlert('密码不能为空!')
        }else if(this.passwordLabel.string.length < 6 || this.passwordLabel.string.length > 10){
            this.app.showAlert('请设置6-10位新密码！')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }
    // 绑定资金密码
    fetchBindAccountPay(){
        var url = `${this.app.UrlData.host}/api/user_funds_password/bindPassword`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id)
        this.FormData.append('password', this.passwordLabel.string);
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.app.fetchIndex();
                this.parentComponent.fetchIndex()
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    deletePassword(){
        this.passwordLabel.string = '点击输入';
        this.app.setInputColor('',this.passwordLabel);
    }

    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
