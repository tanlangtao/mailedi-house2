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
    InfoAlert : cc.Prefab = null;

    @property()
    public UrlData : any = [];
    public Client  = null;
    public config = null;
    public token: string = '';

    protected onLoad(): void {
        this.config = new Config();
        this.UrlData =  this.config.getUrlData();
        this.token = this.config.token;
        console.log(this.token);
        this.Client = new ClientMessage();
    }

    exitBtnClick(){
        this.Client.send('__done',{},()=>{})
    }

    showSellAlert(){
        let node = cc.instantiate(this.SellAlert);
        this.node.addChild(node);
    }

    showInforAlert(){
        let node = cc.instantiate(this.InfoAlert);
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
}
