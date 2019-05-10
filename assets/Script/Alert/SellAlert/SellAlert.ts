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
    public accountInfo =  null;
    public sell_gold = null;
    public app = null;
    public showZfbSelect = false;
    public showBankSelect = false;
    public isReceive = true;
    public zfbData = [];
    public bankData = [];
    public Info = [];
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.amountInput,1);
        this.app.getPublicInput(this.priceInput,3);
        this.app.getPublicInput(this.sillInput,1);
        this.fetchIndex();
    }

    public fetchIndex() {
        this.accountInfo = this.app.accountInfo;
        this.init();
        //申请出售金币接口
        let url = `${this.app.UrlData.host}/api/sell_gold/applyIndex?token=${this.app.token}`;
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
        for(let i = 0 ;i < this.accountInfo.data.list.length ;i++){
            let data = this.accountInfo.data.list[i];
            if(data.type == 2){
                this.zfbData.push(data)
            }else if (data.type == 3){
                this.bankData.push(data)
            }
        }
    }

    selectZfbClick(){
        if(this.zfbData.length == 0) {
            this.app.showAlert('未设置支付宝');
            return;
        }
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
                    data:this.zfbData[i],
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
        if(this.bankData.length == 0) {
            this.app.showAlert('未设置银行卡');
            return;
        }
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
                    data:this.bankData[i],
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
        let amount = Number(this.amountInput.string);
        let price = Number(this.priceInput.string);
        let sill = Number(this.sillInput.string);
        let minAmount = Number(this.sell_gold.min_amount);
        let maxAmount = Number(this.sell_gold.max_amount);
        let minPrice = Number(this.sell_gold.min_exchange_price);
        let maxPrice = Number(this.sell_gold.max_exchange_price);
        let minSill = Number(this.sell_gold.min_exchange_gold);
        //剩余金币
        let gameGold = Number(this.app.game_gold);
        if(this.amountInput.string == ''||this.priceInput.string == ''||this.sillInput.string ==''){
            this.app.showAlert('上架信息不能为空！');
        }else if(this.Info.length == 0){
            this.app.showAlert('请至少选择一种收款方式！');
        }else if(amount > gameGold){
            this.app.showAlert(`当前剩余金币${gameGold}！`);
        }else if(amount > maxAmount || amount < minAmount){
            this.app.showAlert('金币不符合范围');
        }else if(price > maxPrice || price < minPrice){
            this.app.showAlert('单价不符合范围');
        }else if(sill < minSill){
            this.app.showAlert('最低交易额不符合范围！');
        }else{
            this.submitSellGoldInfo();
            this.node.removeFromParent();
        }
    }

    public submitSellGoldInfo(){
        let pay_account = [];
        this.Info.forEach((item,index)=>{
            if(item){
                pay_account.push(item)
            }
        });
        var url = `${this.app.UrlData.host}/api/sell_gold/submitSellGoldInfo`;
        this.FormData = new FormData();
        this.FormData.append('user_id', this.app.UrlData.user_id)
        this.FormData.append('user_name', decodeURI(this.app.UrlData.user_name))
        this.FormData.append('gold', this.amountInput.string)
        this.FormData.append('exchange_price', this.priceInput.string)
        this.FormData.append('pay_account', JSON.stringify(pay_account))
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
