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

    @property(cc.Node)
    content : cc.Node = null;

    @property()
    public UrlData : any = [];
    public Client  = null;
    public config = null;
    public token: string = '';

    protected onLoad(): void {
        this.config = new Config();
        this.UrlData =  this.config.getUrlData();
        this.UrlData.host = 'http://10.63.60.59:8088';
        this.token = this.config.token;
        this.Client = new ClientMessage();
    }

    exitBtnClick(){
        this.Client.send('__done',{},()=>{})
    }

    showSellAlert(){
        let node = cc.instantiate(this.SellAlert);
        this.node.addChild(node);
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

    public showAlert(data) {
        var node = cc.instantiate(this.publicAlert);
        this.node.addChild(node);
        node.getComponent('PublicAlert').init(data);
    }

    public showSellHistory(){
        var node = cc.instantiate(this.sellHistory);
        this.node.addChild(node);
    }

    public showMain(){
        var node = cc.instantiate(this.Main);
        this.content.addChild(node);
    }

    public showGive(){
        var node = cc.instantiate(this.Give);
        this.content.addChild(node);
    }

    public showSetPasswordAlert(self){
        var node = cc.instantiate(this.SetPasswordAlert);
        this.node.addChild(node);
        node.getComponent('SetPasswordAlert').init({
            parentComponent:self
        })

    }

    public showTestPasswordAlert(self,type){
        var node = cc.instantiate(this.TestPasswordAlert);
        this.node.addChild(node);
        node.getComponent('TestPasswordAlert').init({
            parentComponent:self,
            type : type
        })
    }
    public showChangePasswordAlert(self){
        var node = cc.instantiate(this.ChangePasswordAlert);
        this.node.addChild(node);
        node.getComponent('ChangePasswordAlert').init({
            parentComponent:self
        })
    }

    public showGiveHistory(){
        var node = cc.instantiate(this.GiveHistory);
        this.content.addChild(node);
    }

    public showReceiveHistory(){
        var node = cc.instantiate(this.ReceiveHistory);
        this.content.addChild(node);
    }

    public showAccNum(){
        var node = cc.instantiate(this.AccNum);
        this.content.addChild(node);
    }

    public showAddTypeAlert(){
        var node = cc.instantiate(this.AddTypeAlert);
        this.node.addChild(node);
    }

    public showAlipayAccountAlert(data){
        var node = cc.instantiate(this.AlipayAccountAlert);
        this.node.addChild(node);
        node.getComponent('AlipayAccountAlert').init({
            text:data.text,
            action:data.action,
            itemId:data.itemId
        })
    }

    public showBankAccountAlert(data){
        var node = cc.instantiate(this.BankAccountAlert);
        this.node.addChild(node);
        node.getComponent('BankAccountAlert').init({
            text:data.text,
            action:data.action,
            itemId:data.itemId
        })
    }
}
