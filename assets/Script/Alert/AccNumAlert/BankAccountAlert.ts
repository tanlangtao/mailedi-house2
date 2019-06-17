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

    @property(cc.Prefab)
    BankSelectItem : cc.Prefab = null;

    @property(cc.EditBox)
    nameInput: cc.EditBox = null;

    @property(cc.EditBox)
    accountInput: cc.EditBox = null;

    @property(cc.EditBox)
    bankNameInput: cc.EditBox = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property(cc.Node)
    titleSprite : cc.Node = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    accountLabel:cc.Label = null;

    @property(cc.Label)
    bankNameLabel:cc.Label = null;

    @property()
    FormData = new FormData();
    showSelect = false;
    app = null;
    action = null;
    itemId = null;

    public init(data){
        this.action = data.action;
        this.itemId = data.itemId;
    }
    // LIFE-CYCLE CALLBACKS:
    changeContent(data){
        this.accountInput.string = data.card_num;
        this.nameInput.string = data.card_name;
        this.selectLabel.string = data.bank_name;
        this.bankNameInput.string = data.branch_name;
        this.app.loadFont('/xiugaiyinhng',this.titleSprite);

        this.accountLabel.string = data.card_num;
        this.nameLabel.string = data.card_name;
        this.bankNameLabel.string = data.branch_name;
    }
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.accountInput,1);
        this.app.getPublicInput(this.nameInput,2);
        this.app.getPublicInput(this.bankNameInput,2);

        this.app.setComponent('alertLogin').setMethod('setAccountLabel', (text) => this.setAccountLabel(text));
        this.app.setComponent('alertLogin').setMethod('setNameLabel', (text) => this.setNameLabel(text));
        this.app.setComponent('alertLogin').setMethod('setBankLabel', (text) => this.setBankLabel(text));
        //根据当前环境选择使用的输入组件
        if(this.app.UrlData.client != 'desktop'){
            this.nameInput.node.active = false;
            this.accountInput.node.active = false;
            this.bankNameInput.node.active = false;

            this.nameLabel.node.active = true;
            this.accountLabel.node.active = true;
            this.bankNameLabel.node.active = true;
        }else{
            this.nameInput.node.active = true;
            this.accountInput.node.active = true;
            this.bankNameInput.node.active = true;

            this.nameLabel.node.active = false;
            this.accountLabel.node.active = false;
            this.bankNameLabel.node.active = false;
        }
    }

    setAccountLabel(msg) {
        let msg2 = this.app.labelType(msg,6);
        this.accountLabel.string = msg2 || '请输入卡号';
        this.setInputColor(msg2,this.accountLabel);
    }

    setNameLabel(msg) {
        let msg2 = this.app.labelType(msg,2);
        this.nameLabel.string = msg2 || '请输入姓名';
        this.setInputColor(msg2,this.nameLabel);
    }

    setBankLabel(msg) {
        let msg2 = this.app.labelType(msg,5);
        this.bankNameLabel.string = msg2 || '请输入开户行';
        this.setInputColor(msg2,this.bankNameLabel);
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
        this.app.Client.send('__oninput', { text: this.accountLabel.string == '请输入卡号' ? "" :this.accountLabel.string,
            component: 'alertLogin', method: 'setAccountLabel' })
    }

    changeNameLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.nameLabel.string == '请输入姓名' ? "" :this.nameLabel.string,
            component: 'alertLogin', method: 'setNameLabel' })
    }

    changeBankLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.bankNameLabel.string == '请输入开户行' ? "" :this.bankNameLabel.string,
            component: 'alertLogin', method: 'setBankLabel' })
    }
    onClick(){
        if(this.app.UrlData.client != 'desktop'){
            if(this.accountLabel.string == '请输入卡号' || this.nameLabel.string == '请输入姓名'){
                this.app.showAlert('姓名和卡号不能为空!')
            }else if(this.accountLabel.string.length>19||this.accountLabel.string.length<15){
                this.app.showAlert('无效卡号！')
            }else if(this.selectLabel.string == '请选择银行'){
                this.app.showAlert('请选择银行！')
            }else if(this.bankNameLabel.string == '请输入开户行'){
                this.app.showAlert('开户行不能为空！')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }else{
            if(this.accountInput.string == '' || this.nameInput.string == ''){
                this.app.showAlert('姓名和卡号不能为空!')
            }else if(this.accountInput.string.length>19||this.accountInput.string.length<15){
                this.app.showAlert('无效卡号！')
            }else if(this.selectLabel.string == '请选择银行'){
                this.app.showAlert('请选择银行！')
            }else if(this.bankNameInput.string == ''){
                this.app.showAlert('开户行不能为空！')
            }else{
                this.fetchBindAccountPay();
                this.node.removeFromParent();
            }
        }
    }

    fetchBindAccountPay(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');
        var url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        let obj = {};
        if(this.app.UrlData.client != 'desktop'){
            obj = {
                card_num:this.accountLabel.string,
                card_name:this.nameLabel.string,
                bank_name:this.selectLabel.string,
                branch_name:this.bankNameLabel.string,
            };
        }else{
            obj = {
                card_num:this.accountInput.string,
                card_name:this.nameInput.string,
                bank_name:this.selectLabel.string,
                branch_name:this.bankNameInput.string,
            };
        }
        let info = JSON.stringify(obj);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name));
        this.FormData.append('action',this.action);
        this.FormData.append('type','3');
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

    selectClick(){
        var results = ['中国农业银行','交通银行','中国建设银行','兴业银行','民生银行','中信银行','华夏银行','中国工商银行','浦发银行','招商银行','中国银行']
        if(!this.showSelect){
            for( var i = 0 ; i < results.length ; i++){
                var node = cc.instantiate(this.BankSelectItem);
                this.selectContent.addChild(node);
                node.getComponent('BankSelectItem').init({
                    text:results[i],
                    parentComponent:this,
                    index:i
                })
            }
            this.showSelect = true;
        }else{
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }

    deleteName(){
        if(this.app.UrlData.client != 'desktop'){
            this.nameLabel.string = '请输入姓名';
            this.setInputColor('',this.nameLabel);
        }else{
            this.nameInput.string = '';
        }
    }

    deleteAccount(){
        if(this.app.UrlData.client != 'desktop'){
            this.accountLabel.string = '请输入卡号';
            this.setInputColor('',this.accountLabel);
        }else{
            this.accountInput.string = '';
        }
    }

    deleteBankName(){
        if(this.app.UrlData.client != 'desktop'){
            this.bankNameLabel.string = '请输入开户行';
            this.setInputColor('',this.bankNameLabel);
        }else{
            this.bankNameInput.string = '';
        }
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
