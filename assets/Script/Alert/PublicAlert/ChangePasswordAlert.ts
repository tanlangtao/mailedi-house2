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
    oldPasswordLabel : cc.Label = null;

    @property(cc.Label)
    newPasswordLabel : cc.Label = null;

    @property(cc.Label)
    repeatPasswordLabel : cc.Label = null;

    @property()
    FormData = new FormData();
    parentComponent  = null;
    showSelect = false;
    public app = null;

    public init(data){
        this.parentComponent = data.parentComponent;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    setOldPassword() {
        this.app.showKeyBoard(this.oldPasswordLabel,4);
    }

    setNewPassword() {
        this.app.showKeyBoard(this.newPasswordLabel,4);
    }

    setRepeatPassword() {
        this.app.showKeyBoard(this.repeatPasswordLabel,4);
    }
    onClick(){
        if(this.oldPasswordLabel.string == '点击输入' || this.newPasswordLabel.string == '点击输入'|| this.repeatPasswordLabel.string == '点击输入'){
            this.app.showAlert('密码不能为空!')
        }else if(this.newPasswordLabel.string.length < 6 || this.newPasswordLabel.string.length > 10){
            this.app.showAlert('请设置6-10位新密码！')
        }else if(this.newPasswordLabel.string != this.repeatPasswordLabel.string){
            this.app.showAlert('两次密码输入不一致！')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        var url = `${this.app.UrlData.host}/api/user_funds_password/updatePassword`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id)
        this.FormData.append('old_password', this.oldPasswordLabel.string);
        this.FormData.append('password',this.newPasswordLabel.string);
        this.FormData.append('token',this.app.token);
        this.FormData.append('version',this.app.version);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.app.fetchIndex();
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    deleteOld(){
        this.oldPasswordLabel.string = '点击输入';
        this.app.setInputColor('',this.oldPasswordLabel);
    }

    deleteNew(){
        this.newPasswordLabel.string = '点击输入';
        this.app.setInputColor('',this.newPasswordLabel);
    }

    deleteRepeat(){
        this.repeatPasswordLabel.string = '点击输入';
        this.app.setInputColor('',this.repeatPasswordLabel);
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
