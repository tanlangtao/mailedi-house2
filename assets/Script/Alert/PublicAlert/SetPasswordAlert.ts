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
    passwordInput: cc.EditBox = null;

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
        this.app.getPublicInput(this.passwordInput,4);

        this.app.setComponent('alertLogin').setMethod('setPassword', (text) => this.setPassword(text));
        //根据当前环境选择使用的输入组件
        if(this.app.UrlData.client != 'desktop'){
            this.passwordInput.node.active = false;
            this.passwordLabel.node.active = true;
        }else{
            this.passwordInput.node.active = true;
            this.passwordLabel.node.active = false;
        }
    }

    setPassword(msg) {
        console.log(msg);
        let msg2 = this.app.labelType(msg,4);
        this.passwordLabel.string = msg2 || '(6-10位)';
        this.setInputColor(msg2,this.passwordLabel);
    }

    setInputColor(msg,input){
        let color1 = new cc.Color(212, 223, 255);
        let color2 = new cc.Color(187, 187, 187);
        //设置字的颜色
        msg == '' ? input.node.color = color2:input.node.color = color1;
    }
    //Label点击回调
    changeAccountLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.passwordLabel.string == '(6-10位)' ? "" :this.passwordLabel.string,
            component: 'alertLogin', method: 'setPassword' })
    }

    onClick(){

        if(this.app.UrlData.client != 'desktop'){
            if(this.passwordLabel.string == '(6-10位)' ){
                this.app.showAlert('密码不能为空!')
            }else if(this.passwordLabel.string.length < 6 || this.passwordLabel.string.length > 10){
                this.app.showAlert('请设置6-10位新密码！')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }else{
            if(this.passwordInput.string == '' ){
                this.app.showAlert('密码不能为空!')
            }else if(this.passwordInput.string.length < 6 || this.passwordInput.string.length > 10){
                this.app.showAlert('请设置6-10位新密码！')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }
    }
    // 绑定资金密码
    fetchBindAccountPay(){
        var url = `${this.app.UrlData.host}/api/user_funds_password/bindPassword`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id)
        this.FormData.append('password',this.app.UrlData.client != 'desktop'? this.passwordLabel.string :this.passwordInput.string);
        this.FormData.append('token',this.app.token);
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
    deletePassword(){
        if(this.app.UrlData.client != 'desktop'){
            this.passwordLabel.string = '(6-10位)';
            this.setInputColor('',this.passwordLabel);
        }else{
            this.passwordInput.string = '';
        }
    }

    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
