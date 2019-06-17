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
    passwordLabel: cc.Label = null;

    @property()
    FormData = new FormData();
    showSelect = false;
    type  = null;
    public  app = null;
    public init(type){
        this.type = type;
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
                this.app.showAlert('密码错误！')
            }else{
                this.node.removeFromParent();
                this.fetchcheckPassword();
            }
        }else{
            if(this.passwordInput.string == '' ){
                this.app.showAlert('密码不能为空!')
            }else if(this.passwordInput.string.length < 6 || this.passwordInput.string.length > 10){
                this.app.showAlert('密码错误！')
            }else{
                this.node.removeFromParent();
                this.fetchcheckPassword();
            }
        }
    }

    fetchcheckPassword(){

        if(this.app.UrlData.client != 'desktop'){
            var url = `${this.app.UrlData.host}/api/user_funds_password/checkPassword?user_id=${this.app.UrlData.user_id}&password=${this.passwordLabel.string}&token=${this.app.token}`;
        }else{
            var url = `${this.app.UrlData.host}/api/user_funds_password/checkPassword?user_id=${this.app.UrlData.user_id}&password=${this.passwordInput.string}&token=${this.app.token}`;
        }

        fetch(url,{
            method:'GET',
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //验证成功，保存验证结果
                this.app.isTestPassworld = true;
                // type = 1,显示收付款信息
                //type =2 ,显示出售
                // type =6 ,确认赠送
                if(this.type == 1){
                    var self = this;
                    var timer = setTimeout(()=>{
                        self.app.showAccNum()
                        clearTimeout(timer);
                    },400)
                }else if(this.type == 2){
                    var self = this;
                    var timer = setTimeout(()=>{
                        self.app.showSellAlert()
                        clearTimeout(timer);
                    },400)
                }else if(this.type == 6){
                    var give = cc.find('Canvas/content/Give').getComponent('Give');
                    give.fetchGive();
                }

            }else{
                this.app.isTestPassworld = false;
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
