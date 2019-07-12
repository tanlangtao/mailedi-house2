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
    public pay_url = '';
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

        this.accountLabel.string = data.account_card;
        this.firstNameLabel.string = data.account_surname;
        this.lastNameLabel.string = data.account_first_name;
    }

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.config.uploadImg();

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
        if(this.app.UrlData.client != 'desktop'){
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
        this.accountLabel.string = msg2 || '请输入账号';
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
        let color1 = new cc.Color(212, 223, 255);
        let color2 = new cc.Color(187, 187, 187);
        //设置字的颜色
        msg == '' ? input.node.color = color2:input.node.color = color1;
    }
    //Label点击回调
    changeAccountLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.accountLabel.string == '请输入账号' ? "" :this.accountLabel.string,
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
        if(this.app.UrlData.client != 'desktop'){
            if(this.accountLabel.string == '请输入账号'
                || this.firstNameLabel.string == ''
                || this.lastNameLabel.string == '' )
            {
                this.app.showAlert('输入不能为空!')
            }else{
                this.fetchBindAccountPay();
                this.removeSelf();
            }
        }else{
            if(this.accountInput.string == ''
                || this.firstNameInput.string == ''
                || this.lastNameInput.string == '' )
            {
                this.app.showAlert('输入不能为空!')
            }else{
                this.fetchBindAccountPay();
                this.removeSelf();
            }
        }
    }

    fetchBindAccountPay(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');

        let url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        let obj = {};
        if(this.app.UrlData.client != 'desktop'){
            obj = {
                account_card:this.accountLabel.string,
                account_surname:this.firstNameLabel.string,
                account_first_name:this.lastNameLabel.string,
                account_name:this.nameLabel.string,
                pay_url:this.pay_url,
            };
        }else{
            obj = {
                account_card:this.accountInput.string,
                account_surname:this.firstNameInput.string,
                account_first_name:this.lastNameInput.string,
                account_name:this.nameLabel.string,
                pay_url:this.pay_url,
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
        this.FormData.append('version',this.app.version);
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
        if(this.app.UrlData.client != 'desktop'){
            this.firstNameLabel.string = '';
            this.setInputColor('',this.firstNameLabel);
            this.nameLabel.string = `${this.firstNameLabel.string}${this.lastNameLabel.string}`;
        }else{
            this.firstNameInput.string = '';
            this.nameLabel.string = `${this.firstNameInput.string}${this.lastNameInput.string}`
        }
    }

    deleteLastName(){
        if(this.app.UrlData.client != 'desktop'){
            this.lastNameLabel.string = '';
            this.setInputColor('',this.lastNameLabel);
            this.nameLabel.string = `${this.firstNameLabel.string}${this.lastNameLabel.string}`;
        }else{
            this.lastNameInput.string = '';
            this.nameLabel.string = `${this.firstNameInput.string}${this.lastNameInput.string}`;
        }
    }

    deleteAccount(){
        if(this.app.UrlData.client != 'desktop'){
            this.accountLabel.string = '请输入账号';
            this.setInputColor('',this.accountLabel);
        }else{
            this.accountInput.string = '';
        }
    }
    
    removeSelf(){
        let input :any = document.getElementById('imgInput');
        let dom = document.getElementById('Cocos2dGameContainer');
        dom.removeChild(input);
        this.node.removeFromParent();
    }
    
    uploadImg(){
        let self = this;
        let input :any = document.getElementById('imgInput');
        let newscript = document.createElement("script");
        newscript.src='../../lib/qrcode.js';
        if(input.files.length<=0){
            this.app.showAlert('请先选择图片！')
        }else{
            qrcode.decode(this.getObjectURL(input.files[0]));
            qrcode.callback = function(imgMsg){
                //判断是否包含微信或支付宝子串
                imgMsg  = imgMsg.toUpperCase();
                if(imgMsg.indexOf('QR.ALIPAY.COM')>= 0 ||imgMsg.indexOf('WXP')>= 0 ){
                    self.app.showAlert('二维码上传成功！',imgMsg)
                    self.pay_url = imgMsg;
                }else{
                    self.app.showAlert('请选择正确的二维码上传！')
                }
                console.log(imgMsg)
            }
        }
       
    }
     getObjectURL = function(file){
        var url = null ; 
        url = window.URL.createObjectURL(file) ;
        // if (window.createObjectURL!=undefined) { // basic
        //     url = window.createObjectURL(file) ;
        // } else if (window.URL!=undefined) { // mozilla(firefox)
        //     url = window.URL.createObjectURL(file) ;
        // } else if (window.webkitURL!=undefined) { // webkit or chrome
        //     url = window.webkitURL.createObjectURL(file) ;
        // }
        return url;
    }
}
