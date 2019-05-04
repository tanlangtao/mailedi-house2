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

    @property()
    public UrlData : any = [];
    public token : string = '';
    FormData = new FormData();
    parentComponent  = null;
    showSelect = false;
    type  = null;
    public  app = null;
    public init(data){
        this.parentComponent = data.parentComponent;
        this.type = data.type;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.passwordInput,1);
    }

    start () {

    }

    onClick(){

        if(this.passwordInput.string == '' ){
            this.app.showAlert('密码不能为空!')
        }else if(this.passwordInput.string.length < 6 || this.passwordInput.string.length > 10){
            this.app.showAlert('密码错误！')
        }else{
            this.node.removeFromParent();
            this.fetchcheckPassword();
        }
    }

    fetchcheckPassword(){
        var url = `${this.UrlData.host}/api/user_funds_password/checkPassword?user_id=${this.UrlData.user_id}&password=${this.passwordInput.string}&token=${this.token}`;
        fetch(url,{
            method:'GET',
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                // type=1,弹出绑定帐户
                // type =2 , 确认兑换
                // type =3 , 申请人工兑换
                // type =4 , 确认出售金币
                // type =5 , 确认回收金币
                // type =6 , 确认赠送
                if(this.type == 1){
                    var self = this;
                    var timer = setTimeout(()=>{
                        self.parentComponent.showAccountAlert()
                        clearTimeout(timer);
                    },500)
                }else if(this.type == 2){
                    this.parentComponent.fetchwithDrawApply();
                }else if(this.type == 3){
                    this.parentComponent.fetchRgDh();
                }else if(this.type == 4){
                    this.parentComponent.fetchSell_gold();
                }else if(this.type == 5){
                    this.parentComponent.fetchsubmitRecycleGoldInfo();
                }else if(this.type == 6){
                    this.parentComponent.fetchGive();
                }

            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    deletePassword(){
        this.passwordInput.string = '';
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
