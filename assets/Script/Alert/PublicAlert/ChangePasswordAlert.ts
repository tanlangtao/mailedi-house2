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
    @property(cc.EditBox)
    oldPasswordInput: cc.EditBox = null;

    @property(cc.EditBox)
    newPasswordInput: cc.EditBox = null;

    @property(cc.EditBox)
    repeatPasswordInput: cc.EditBox = null;

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
        this.app.getPublicInput(this.oldPasswordInput,1);
        this.app.getPublicInput(this.newPasswordInput,1);
        this.app.getPublicInput(this.repeatPasswordInput,1);

        this.app.setComponent('alertLogin').setMethod('setOldPassword', (text) => this.setOldPassword(text));
        this.app.setComponent('alertLogin').setMethod('setNewPassword', (text) => this.setNewPassword(text));
        this.app.setComponent('alertLogin').setMethod('setRepeatPassword', (text) => this.setRepeatPassword(text));
        //根据当前环境选择使用的输入组件
        if(this.app.UrlData.client == 'ios'){
            this.oldPasswordInput.node.active = false;
            this.newPasswordInput.node.active = false;
            this.repeatPasswordInput.node.active = false;

            this.oldPasswordLabel.node.active = true;
            this.newPasswordLabel.node.active = true;
            this.repeatPasswordLabel.node.active = true;
        }else{
            this.oldPasswordInput.node.active = true;
            this.newPasswordInput.node.active = true;
            this.repeatPasswordInput.node.active = true;

            this.oldPasswordLabel.node.active = false;
            this.newPasswordLabel.node.active = false;
            this.repeatPasswordLabel.node.active = false;
        }
    }

    setOldPassword(msg) {
        let msg2 = this.app.labelType(msg,4);
        this.oldPasswordLabel.string = msg2 || '(6-10位)';
        this.setInputColor(msg2,this.oldPasswordLabel);
    }

    setNewPassword(msg) {
        let msg2 = this.app.labelType(msg,4);
        this.newPasswordLabel.string = msg2 || '(6-10位)';
        this.setInputColor(msg2,this.newPasswordLabel);
    }

    setRepeatPassword(msg) {
        let msg2 = this.app.labelType(msg,4);
        this.repeatPasswordLabel.string = msg2 || '(6-10位)';
        this.setInputColor(msg2,this.repeatPasswordLabel);
    }
    setInputColor(msg,input){
        let color1 = new cc.Color(255, 255, 255);
        let color2 = new cc.Color(187, 187, 187);
        //设置字的颜色
        msg == '' ? input.node.color = color2:input.node.color = color1;
    }
    //Label点击回调
    changeOldLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.oldPasswordLabel.string == '(6-10位)' ? "" :this.oldPasswordLabel.string,
            component: 'alertLogin', method: 'setOldPassword' })
    }

    changeNewLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.newPasswordLabel.string == '(6-10位)' ? "" :this.newPasswordLabel.string,
            component: 'alertLogin', method: 'setNewPassword' })
    }

    changeRepeatLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.repeatPasswordLabel.string == '(6-10位)' ? "" :this.repeatPasswordLabel.string,
            component: 'alertLogin', method: 'setRepeatPassword' })
    }
    onClick(){

        if(this.app.UrlData.client =='ios'){
            if(this.oldPasswordLabel.string == '(6-10位)' || this.newPasswordLabel.string == '(6-10位)'|| this.repeatPasswordLabel.string == '(6-10位)'){
                this.app.showAlert('密码不能为空!')
            }else if(this.newPasswordLabel.string.length < 6 || this.newPasswordLabel.string.length > 10){
                this.app.showAlert('请设置6-10位新密码！')
            }else if(this.newPasswordLabel.string != this.repeatPasswordLabel.string){
                this.app.showAlert('两次密码输入不一致！')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }else{
            if(this.oldPasswordInput.string == '' || this.newPasswordInput.string == ''|| this.repeatPasswordInput.string == ''){
                this.app.showAlert('密码不能为空!')
            }else if(this.newPasswordInput.string.length < 6 || this.newPasswordInput.string.length > 10){
                this.app.showAlert('请设置6-10位新密码！')
            }else if(this.newPasswordInput.string != this.repeatPasswordInput.string){
                this.app.showAlert('两次密码输入不一致！')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }
    }

    fetchBindAccountPay(){
        var url = `${this.app.UrlData.host}/api/user_funds_password/updatePassword`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id)
        this.FormData.append('old_password',this.app.UrlData.client == 'ios' ? this.oldPasswordLabel.string : this.oldPasswordInput.string);
        this.FormData.append('password',this.app.UrlData.client == 'ios' ? this.newPasswordLabel.string :this.newPasswordInput.string);
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.parentComponent.fetchIndex();
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    deleteOld(){
        if(this.app.UrlData.client=='ios'){
            this.oldPasswordLabel.string = '(6-10位)';
            this.setInputColor('',this.oldPasswordLabel);
        }else{
            this.oldPasswordInput.string = '';
        }
    }

    deleteNew(){
        if(this.app.UrlData.client=='ios'){
            this.newPasswordLabel.string = '(6-10位)';
            this.setInputColor('',this.newPasswordLabel);
        }else{
            this.newPasswordInput.string = '';
        }
    }

    deleteRepeat(){
        if(this.app.UrlData.client=='ios'){
            this.repeatPasswordLabel.string = '(6-10位)';
            this.setInputColor('',this.repeatPasswordLabel);
        }else{
            this.repeatPasswordInput.string = '';
        }
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
