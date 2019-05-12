// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "./lib/Config";
import ClientMessage from "./lib/ClientMessage"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    PublicInputAlert: cc.Prefab = null;

    @property(cc.Prefab)
    publicAlert : cc.Prefab = null;

    @property(cc.Prefab)
    SellAlert : cc.Prefab = null;

    @property(cc.Prefab)
    sellHistory : cc.Prefab = null;

    @property(cc.Prefab)
    TradeHistory : cc.Prefab = null;

    @property(cc.Prefab)
    Main : cc.Prefab = null;

    @property(cc.Prefab)
    Give : cc.Prefab = null;

    @property(cc.Prefab)
    SetPasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    TestPasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    ChangePasswordAlert : cc.Prefab = null;

    @property(cc.Prefab)
    ReceiveHistory : cc.Prefab = null;

    @property(cc.Prefab)
    GiveHistory : cc.Prefab = null;

    @property(cc.Prefab)
    AccNum : cc.Prefab = null;

    @property(cc.Prefab)
    AddTypeAlert : cc.Prefab = null;

    @property(cc.Prefab)
    AlipayAccountAlert : cc.Prefab = null;

    @property(cc.Prefab)
    BankAccountAlert : cc.Prefab = null;

    @property(cc.Prefab)
    DeleteAccountAlert : cc.Prefab = null;

    @property(cc.Prefab)
    WriteGoldAlert : cc.Prefab = null;

    @property(cc.Prefab)
    CancleAlert : cc.Prefab = null;

    @property(cc.Node)
    content : cc.Node = null;

    @property()
    public UrlData : any = [];
    public Client  = null;
    public config = null;
    public token: string = '';
    public idx = 0;
    //判断密码
    public is_password = null;
    //剩余金额
    public game_gold = null;
    //收款信息
    public accountInfo = null;

    protected onLoad(): void {
        this.config = new Config();
        this.UrlData =  this.config.getUrlData();
        this.token = this.config.token;
        this.Client = new ClientMessage();
        this.UrlData.host = 'http://new.recharge.0717996.com';
        this.fetchIndex();
    }

    start(){
        this.Client.send('__done',{},()=>{})
    }

    public loadIcon(url,parent){
        var node = new cc.Node('Sprite');

        var sp = node.addComponent(cc.Sprite);
        cc.loader.loadRes(url,cc.SpriteFrame,(err, spriteFrame)=>{
            sp.spriteFrame = spriteFrame;
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.width = 20;
            node.height = 20;
            parent.addChild(node);
        })
    }

    public fetchIndex(){
        this.idx = this.idx +1;
        let url = `${this.UrlData.host}/api/with_draw/index?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.is_password = data.data.is_password;
                this.game_gold = data.data.game_gold;
            }else{
                this.showAlert(data.msg)
            }
        }).catch((error)=>{
            if(this.idx>=5){
                this.showAlert(' 网络错误，请重试！');
                let self = this;
                //3秒后自动返回大厅
                setTimeout(()=>{self.Client.send('__backtohall',{},()=>{})},2000)
            }else{
                //重新请求数据
                this.fetchIndex();
            }

        })

        //请求支付信息
        url = `${this.UrlData.host}/api/payment_account/accountInfo?user_id=${this.UrlData.user_id}&token=${this.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.accountInfo = data;
            } else {
                this.showAlert(data.msg)
            }
        }).catch((error)=>{
            if(this.idx>=5){
                this.showAlert(' 网络错误，请重试！');
                let self = this;
                //3秒后自动返回大厅
                setTimeout(()=>{self.Client.send('__backtohall',{},()=>{})},2000)
            }else{
                //重新请求数据
                this.fetchIndex();
            }
        });
    }

    public getPublicInput(input,type) {
        var PublicInputAlert = cc.instantiate(this.PublicInputAlert);
        var canvas = cc.find('Canvas');
        input.node.on('editing-did-began', (e) => {
            canvas.addChild(PublicInputAlert);
            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: input
            })
        })
        input.node.on('text-changed', (e) => {
            if(type == 1){
                //验证input type = 1 不能以0开头的整数
                input.string = e.string.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
            }else if(type == 2){
                //验证input type = 2 不能输入特殊字符
                var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
                input.string = e.string.replace(patrn,'');
            }else if(type == 3){
                //验证input,可以输入两位小数
                let reg = /^\d{0,8}\.{0,1}(\d{0,2})?$/;
                input.string = !reg.test(e.string) ? '' :e.string ;
            }

            PublicInputAlert.getComponent('PublicInputAlert').init({
                text: e.string,
                input: input
            })
        })
    }
    // 点击返回大厅
    exitBtnClick(){
        this.Client.send('__backtohall',{},()=>{})
    }
    // 点击出售上架
    shouSellClick(){
        if(this.is_password == 1){
            if(this.accountInfo.data.has_account == 0){
                this.showAlert('请先到收付款账号界面添加收付款方式！')
            }else{
                this.showTestPasswordAlert(2)
            }
        }else{
            this.showSetPasswordAlert(this);
        }
    }
    // 出售上架弹窗
    showSellAlert(){
        let node = cc.instantiate(this.SellAlert);
        this.node.addChild(node);
    }

    // 公共小黑窗
    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        this.node.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }
    // 出售上架历史
    public showSellHistory(){
        var node = cc.instantiate(this.sellHistory);
        this.node.addChild(node);
    }
    // 交易历史
    public showTradeHistory(){
        var node = cc.instantiate(this.TradeHistory);
        this.node.addChild(node);
    }
    // 交易所
    public showMain(){
        var node = cc.instantiate(this.Main);
        this.content.addChild(node);
    }
    // 赠送
    public showGive(){
        var node = cc.instantiate(this.Give);
        this.content.addChild(node);
    }
    // 设置密码弹窗
    public showSetPasswordAlert(self){
        var node = cc.instantiate(this.SetPasswordAlert);
        this.node.addChild(node);
        node.getComponent('SetPasswordAlert').init({
            parentComponent:self
        })
    }
    // 验证密码弹窗
    public showTestPasswordAlert(type){
        var node = cc.instantiate(this.TestPasswordAlert);
        this.node.addChild(node);
        node.getComponent('TestPasswordAlert').init(type)
    }
    // 修改密码弹窗
    public showChangePasswordAlert(self){
        var node = cc.instantiate(this.ChangePasswordAlert);
        this.node.addChild(node);
        node.getComponent('ChangePasswordAlert').init({
            parentComponent:self
        })
    }
    // 赠送历史
    public showGiveHistory(){
        var node = cc.instantiate(this.GiveHistory);
        this.content.addChild(node);
    }
    // 受赠历史
    public showReceiveHistory(){
        var node = cc.instantiate(this.ReceiveHistory);
        this.content.addChild(node);
    }
    // 收付款账号
    public showAccNum(){
        var node = cc.instantiate(this.AccNum);
        this.content.removeAllChildren();
        this.content.addChild(node);
    }
    // 添加账号类型弹窗
    public showAddTypeAlert(){
        var node = cc.instantiate(this.AddTypeAlert);
        this.node.addChild(node);
    }
    // 添加支付宝账号弹窗
    public showAlipayAccountAlert(data){
        var node = cc.instantiate(this.AlipayAccountAlert);
        this.node.addChild(node);
        let AlipayAccountAlert = node.getComponent('AlipayAccountAlert');
        AlipayAccountAlert.init({
            text:data.text,
            action:data.action,
            itemId:data.itemId
        });
        if(data.changeData){
            AlipayAccountAlert.changeContent(data.changeData);
        }

    }
    // 添加银行卡类型弹窗
    public showBankAccountAlert(data){
        var node = cc.instantiate(this.BankAccountAlert);
        this.node.addChild(node);
        let BankAccountAlert = node.getComponent('BankAccountAlert')
        BankAccountAlert.init({
            text:data.text,
            action:data.action,
            itemId:data.itemId
        })
        if(data.changeData){
            BankAccountAlert.changeContent(data.changeData);
        }
    }
    //删账号弹窗
    public showDeleteAccountAlert(data){
        var node = cc.instantiate(this.DeleteAccountAlert);
        this.node.addChild(node);
        node.getComponent('DeleteAccountAlert').init(data)
    }
    //交易弹窗
    public showWriteGoldAlert(data){
        var node = cc.instantiate(this.WriteGoldAlert);
        this.node.addChild(node);
        node.getComponent('WriteGoldAlert').init(data)
    }
    public showCancleAlert(data){
        var node = cc.instantiate(this.CancleAlert);
        this.node.addChild(node);
        node.getComponent('CancleAlert').init(data)
    }

}
