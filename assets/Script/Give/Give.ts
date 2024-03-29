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
    GiveUserAlert : cc.Prefab = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Label)
    czArea: cc.Label = null;

    @property(cc.Label)
    passworldLabel: cc.Label = null;

    @property(cc.Node)
    btnSprite : cc.Node = null;

    @property(cc.Label)
    idLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property
    public data : any = {};
    public searchData : any = {};
    public FormData = new FormData();
    public  app = null;
    public idx = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');

        this.fetchIndex();
    }

    setAmount() {
        this.app.showKeyBoard(this.amountLabel,1);
    }

    setId() {
        this.app.showKeyBoard(this.idLabel,4);
    }

    public fetchIndex(){
        this.idx = this.idx +1;
        var url = `${this.app.UrlData.host}/api/give/index?user_id=${this.app.UrlData.user_id}&token=${this.app.token}&version=${this.app.version}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.data = data;
                this.init();
            }else{

            }
        }).catch((error)=>{
            if(this.idx>=5){
                this.app.showAlert(' 网络错误，请重试！');
                let self = this;
                //3秒后自动返回大厅
                setTimeout(()=>{self.app.Client.send('__backtohall',{},()=>{})},2000)
            }else{
                //重新请求数据
                this.fetchIndex();
            }
        })
    }

    init(){
        var data = this.data.data;
        this.goldLabel.string = this.app.config.toDecimal(data.game_gold);
        this.czArea.string = `赠送范围:(${data.min_amount} - ${data.max_amount})`;
        this.passworldLabel.string = data.is_password == 1 ? '已设置' : '未设置';
        data.is_password == 1 ? '' : this.app.loadFont('/quzz',this.btnSprite);
    }

    showMainClick(){
        this.app.showMain();
        this.node.removeFromParent();
    }
    //验证密码回调type=6
    public fetchGive(){
        var url = `${this.app.UrlData.host}/api/give/giveAmount`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id)
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name))
        this.FormData.append('amount', this.amountLabel.string );
        this.FormData.append('by_id',this.idLabel.string);
        this.FormData.append('by_name',this.searchData.data.game_nick)
        this.FormData.append('client',this.app.UrlData.client)
        this.FormData.append('proxy_user_id',this.app.UrlData.proxy_user_id)
        this.FormData.append('proxy_name',decodeURI(this.app.UrlData.proxy_name))
        this.FormData.append('package_id',this.app.UrlData.package_id)
        this.FormData.append('token',this.app.token)
        this.FormData.append('version',this.app.version);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.app.showAlert('赠送成功！');
                this.fetchIndex();
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }

    accNumClick(){
        if(this.app.is_password == 1){
            if(this.app.isTestPassworld){
                this.app.showAccNum();
            }else{
                this.app.showTestPasswordAlert(1)
            }
        }else if (this.app.is_password == 0){
            this.app.showSetPasswordAlert(this)
        }
    }

    passwordClick(){
        if(this.app.is_password == 1){
            this.app.showChangePasswordAlert(this)
        }else if (this.app.is_password == 0){
            this.app.showSetPasswordAlert(this)
        }
    }
    giveHistoryClick(){
        this.node.destroy();
        this.app.showGiveHistory()
    }

    receiveHistoryClick(){
        this.node.destroy();
        this.app.showReceiveHistory()
    }

    deleteAmount(){
        this.amountLabel.string = '点击输入';
        this.app.setInputColor('',this.amountLabel);
    }

    deleteId() {
            this.idLabel.string = '点击输入';
            this.app.setInputColor('',this.idLabel);
    }

    showGiveUserAlert(){
        var node = cc.instantiate(this.GiveUserAlert);
        var canvas = cc.find('Canvas');

        var url = `${this.app.UrlData.host}/api/give/searchByUser?by_id=${this.idLabel.string}&token=${this.app.token}&version=${this.app.version}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.searchData = data;
                canvas.addChild(node);
                node.getComponent('GiveUserAlert').init({
                    data:data.data,
                    gold:this.amountLabel.string,
                    parentComponent:this
                })
            }else{
                this.app.showAlert(data.msg)
            }
        })

    }

    onClick(){
        var amount = Number(this.amountLabel.string);
        let given = this.data.data;
        var minAmount = Number(given.min_amount);
        var maxAmount = Number(given.max_amount);
        if(this.data.data.is_password == 0){
            this.app.showAlert('请先设置资金密码!')
        }else if(this.idLabel.string =='点击输入'){
            this.app.showAlert('赠送ID不能为空！')
        }else if(this.amountLabel.string == '点击输入'){
            this.app.showAlert('赠送金额不能为空！')
        }else if(amount % minAmount != 0){
            this.app.showAlert(`赠送金额必须是${minAmount}的倍数!`)
        }else if(amount > this.data.data.game_gold){
            this.app.showAlert(`赠送金额不能大于金币余额!`)
        }else if(amount < minAmount || amount >maxAmount){
            this.app.showAlert('超出赠送范围!')
        }else{
            this.showGiveUserAlert();
        }
    }
    // update (dt) {}
}
