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
    amountInput: cc.EditBox = null;

    @property(cc.EditBox)
    priceInput: cc.EditBox = null;

    @property(cc.EditBox)
    sillInput: cc.EditBox = null;

    @property(cc.Label)
    selectZfbLabel: cc.Label = null;

    @property(cc.Label)
    selectBankLabel: cc.Label = null;

    @property(cc.Node)
    selectZfbContent: cc.Node = null;

    @property(cc.Node)
    selectBankContent: cc.Node = null;

    @property(cc.Prefab)
    sellSelectItem : cc.Prefab = null;

    @property(cc.Label)
    areaLabel1: cc.Label = null;

    @property(cc.Label)
    areaLabel2: cc.Label = null;

    @property(cc.Label)
    areaLabel3: cc.Label = null;

    @property()
    FormData = new FormData();
    public results =  null;
    public sell_gold = null;
    public app = null;
    public showZfbSelect = false;
    public showBankSelect = false;
    public isReceive = true;
    public zfbData = [];
    public bankData = [];
    public ZfbInfo = null;
    public BankInfo = null;
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.amountInput,1);
        this.app.getPublicInput(this.priceInput,3);
        this.app.getPublicInput(this.sillInput,1);
        this.fetchIndex();
    }

    public fetchIndex() {
        //请求支付信息
        let url = `${this.app.UrlData.host}/api/payment_account/accountInfo?user_id=${this.app.UrlData.user_id}&token=${this.app.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {
                this.app.showAlert(data.msg)
            }
            //收到结果
            this.isReceive = true;
        });
        //申请出售金币接口
        url = `${this.app.UrlData.host}/api/sell_gold/applyIndex?token=${this.app.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            if (data.status == 0) {
                this.sell_gold = data.data;
                this.areaLabel1.string = `范围(${data.data.min_amount}-${data.data.max_amount})`
                this.areaLabel2.string = `范围(${data.data.min_exchange_price}-${data.data.max_exchange_price})`
                this.areaLabel3.string = `范围(>=${data.data.min_exchange_gold})`
            } else {
                this.app.showAlert(data.msg)
            }
            //收到结果
            this.isReceive = true;
        })

    }
    init(){
        for(let i = 0 ;i < this.results.data.length ;i++){
            let data = this.results.data[i];
            if(data.type == 2){
                this.zfbData.push(data)
            }else if (data.type == 3){
                this.bankData.push(data)
            }
        }
    }

    selectZfbClick(){
        this.selectBankContent.removeAllChildren();
        if(!this.showZfbSelect && this.isReceive){
            for( var i = 0 ; i < this.zfbData.length ; i++){
                var node = cc.instantiate(this.sellSelectItem);
                this.selectZfbContent.addChild(node);
                node.getComponent('SellSelectItem').init({
                    text:JSON.parse(this.zfbData[i].info).account_card,
                    Label:this.selectZfbLabel,
                    showSelect:this.showZfbSelect,
                    selectContent:this.selectZfbContent,
                    info:JSON.parse(this.zfbData[i].info),
                    parentCom:this
                })
            }
            this.showZfbSelect = true;
        }else{
            this.selectZfbContent.removeAllChildren();
            this.showZfbSelect = false;
        }
    }
    selectBankClick(){
        this.selectZfbContent.removeAllChildren();
        if(!this.showBankSelect && this.isReceive){
            for( var i = 0 ; i < this.bankData.length ; i++){
                var node = cc.instantiate(this.sellSelectItem);
                this.selectBankContent.addChild(node);
                node.getComponent('SellSelectItem').init({
                    text:JSON.parse(this.bankData[i].info).card_num,
                    Label:this.selectBankLabel,
                    showSelect:this.showBankSelect,
                    selectContent:this.selectBankContent,
                    info:JSON.parse(this.bankData[i].info),
                    parentCom:this
                })
            }
            this.showBankSelect = true;
        }else{
            this.selectBankContent.removeAllChildren();
            this.showBankSelect = false;
        }
    }

    onClick(){
        console.log(this.BankInfo,this.ZfbInfo)
        this.submitSellGoldInfo();
        this.node.removeFromParent();
    }

    public submitSellGoldInfo(){
        var url = `${this.app.UrlData.host}/api/sell_gold/submitSellGoldInfo`;
        let pay_account = null;
        if(this.ZfbInfo){
            pay_account.push(this.ZfbInfo)
        }else if(this.ZfbInfo){
            pay_account.push(this.BankInfo)
        }
        this.FormData = new FormData();
        this.FormData.append('user_id', this.app.UrlData.user_id)
        this.FormData.append('user_name', decodeURI(this.app.UrlData.user_name))
        this.FormData.append('gold', this.amountInput.string)
        this.FormData.append('exchange_price', this.priceInput.string)
        this.FormData.append('pay_account', pay_account)
        this.FormData.append('min_gold', this.sillInput.string)
        this.FormData.append('client', this.app.UrlData.client)
        this.FormData.append('proxy_user_id', this.app.UrlData.proxy_user_id)
        this.FormData.append('proxy_name', decodeURI(this.app.UrlData.proxy_name))
        this.FormData.append('package_id', this.app.UrlData.package_id)
        this.FormData.append('token', this.app.token)
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //刷新界面
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg);
            }
        })
    }

    historyClick(){
        this.app.showSellHistory();
    }

    deleteAmount(){
        this.amountInput.string = '';
    }

    deletePrice(){
        this.priceInput.string = '';
    }

    deleteSill(){
        this.sillInput.string = '';
    }

    removeSelf(){
        this.node.destroy();
    }

}
