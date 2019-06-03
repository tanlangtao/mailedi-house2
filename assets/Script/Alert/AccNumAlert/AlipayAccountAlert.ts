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

    @property(cc.EditBox)
    firstNameInput: cc.EditBox = null;

    @property(cc.EditBox)
    lastNameInput: cc.EditBox = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.EditBox)
    accountInput: cc.EditBox = null;

    @property(cc.Node)
    titleSprite : cc.Node = null;

    @property(cc.Label)
    firstNameLabel : cc.Label = null;

    @property(cc.Label)
    lastNameLabel : cc.Label = null;

    @property(cc.Label)
    accountLabel : cc.Label = null;

    @property()
    FormData = new FormData();
    public app = null;
    public action = null;
    public  itemId = null;

    public init(data){
        this.action = data.action;
        this.itemId = data.itemId;
    }
    // LIFE-CYCLE CALLBACKS:

    changeContent(data){
        this.accountInput.string = data.account_card;
        this.nameLabel.string = data.account_name;
        this.firstNameInput.string = data.account_surname;
        this.lastNameInput.string = data.account_first_name;
        this.app.loadFont('/xiugaizfb',this.titleSprite);
    }

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.firstNameInput,2);
        this.app.getPublicInput(this.lastNameInput,2);
        this.app.getPublicInput(this.accountInput,1);
        this.firstNameInput.node.on('text-changed',()=>{
            this.nameLabel.string = `${this.firstNameInput.string}${this.lastNameInput.string}`
        })
        this.lastNameInput.node.on('text-changed',()=>{
            this.nameLabel.string = `${this.firstNameInput.string}${this.lastNameInput.string}`
        })

        this.app.setComponent('alertLogin').setMethod('setAccountLabel', (text) => this.setAccountLabel(text));
        this.app.setComponent('alertLogin').setMethod('setFirstNameLabel', (text) => this.setFirstNameLabel(text));
        this.app.setComponent('alertLogin').setMethod('setLastNameLabel', (text) => this.setLastNameLabel(text));
        //根据当前环境选择使用的输入组件
        if(this.app.UrlData.client == 'ios'){
            this.firstNameInput.node.active = false;
            this.lastNameInput.node.active = false;
            this.accountInput.node.active = false;

            this.firstNameLabel.node.active = true;
            this.lastNameLabel.node.active = true;
            this.accountLabel.node.active = true;
        }else{
            this.firstNameInput.node.active = true;
            this.lastNameInput.node.active = true;
            this.accountInput.node.active = true;

            this.firstNameLabel.node.active = false;
            this.lastNameLabel.node.active = false;
            this.accountLabel.node.active = false;
        }
    }

    setAccountLabel(msg) {
        let msg2 = this.app.labelType(msg,6);
        this.accountLabel.string = msg2 || '请输入账户';
        this.setInputColor(msg2,this.accountLabel);
    }

    setFirstNameLabel(msg) {
        let msg2 = this.app.labelType(msg,2);
        this.firstNameLabel.string = msg2 ;
        this.setInputColor(msg2,this.firstNameLabel);
        this.nameLabel.string = `${this.firstNameLabel.string}${this.lastNameLabel.string}`;
    }

    setLastNameLabel(msg) {
        let msg2 = this.app.labelType(msg,2);
        this.lastNameLabel.string = msg2 ;
        this.setInputColor(msg2,this.lastNameLabel);
        this.nameLabel.string = `${this.firstNameLabel.string}${this.lastNameLabel.string}`;
    }
    setInputColor(msg,input){
        let color1 = new cc.Color(255, 255, 255);
        let color2 = new cc.Color(187, 187, 187);
        //设置字的颜色
        msg == '' ? input.node.color = color2:input.node.color = color1;
    }
    //Label点击回调
    changeAccountLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.accountLabel.string == '请输入账户' ? "" :this.accountLabel.string,
            component: 'alertLogin', method: 'setAccountLabel' })
    }

    changeFirstNameLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.firstNameLabel.string,
            component: 'alertLogin', method: 'setFirstNameLabel' })
    }

    changeLastNameLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.lastNameLabel.string,
            component: 'alertLogin', method: 'setLastNameLabel' })
    }


    onClick(){

        if(this.app.UrlData.client =='ios'){
            if(this.accountLabel.string == '请输入账户'
                || this.firstNameLabel.string == ''
                || this.lastNameLabel.string == '' )
            {
                this.app.showAlert('输入不能为空!')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }else{
            if(this.accountInput.string == ''
                || this.firstNameInput.string == ''
                || this.lastNameInput.string == '' )
            {
                this.app.showAlert('输入不能为空!')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }
    }

    fetchBindAccountPay(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');

        let url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        let obj = {};
        if(this.app.UrlData.client=='ios'){
            obj = {
                account_card:this.accountLabel.string,
                account_surname:this.firstNameLabel.string,
                account_first_name:this.lastNameLabel.string,
                account_name:this.nameLabel.string,
                pay_url:'',
            };
        }else{
            obj = {
                account_card:this.accountInput.string,
                account_surname:this.firstNameInput.string,
                account_first_name:this.lastNameInput.string,
                account_name:this.nameLabel.string,

                pay_url:'',
            };
        }
        let info = JSON.stringify(obj);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name));
        this.FormData.append('action',this.action);
        this.FormData.append('withdraw_type','1');
        this.FormData.append('type','2');
        this.FormData.append('info',info);
        this.FormData.append('client', this.app.UrlData.client)
        this.FormData.append('proxy_user_id', this.app.UrlData.proxy_user_id)
        this.FormData.append('proxy_name', decodeURI(this.app.UrlData.proxy_name))
        this.FormData.append('package_id', this.app.UrlData.package_id)
        this.FormData.append('token',this.app.token);
        if(this.action == 'edit'){
            this.FormData.append('id',this.itemId);
        }
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //刷新界面
                accNum.fetchIndex();
                // 刷新app数据
                this.app.fetchIndex();

                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }

    deleteFirstName(){
        if(this.app.UrlData.client=='ios'){
            this.firstNameLabel.string = '';
            this.setInputColor('',this.firstNameLabel);
            this.nameLabel.string = `${this.firstNameLabel.string}${this.lastNameLabel.string}`;
        }else{
            this.firstNameInput.string = '';
            this.nameLabel.string = `${this.firstNameInput.string}${this.lastNameInput.string}`
        }
    }

    deleteLastName(){
        if(this.app.UrlData.client=='ios'){
            this.lastNameLabel.string = '';
            this.setInputColor('',this.lastNameLabel);
            this.nameLabel.string = `${this.firstNameLabel.string}${this.lastNameLabel.string}`;
        }else{
            this.lastNameInput.string = '';
            this.nameLabel.string = `${this.firstNameInput.string}${this.lastNameInput.string}`;
        }
    }

    deleteAccount(){
        if(this.app.UrlData.client=='ios'){
            this.accountLabel.string = '请输入账户';
            this.setInputColor('',this.accountLabel);
        }else{
            this.accountInput.string = '';
        }
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
