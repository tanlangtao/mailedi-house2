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

    @property(cc.Label)
    passwordLabel: cc.Label = null;

    @property()
    FormData = new FormData();
    showSelect = false;
    type  = null;
    public  app = null;
    public init(type){
        this.type = type;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    inputClick(){
        this.app.showKeyBoard(this.passwordLabel,4);
    }
    
    onClick(){
        if(this.passwordLabel.string == '点击输入' ){
            this.app.showAlert('密码不能为空!')
        }else if(this.passwordLabel.string.length < 6 || this.passwordLabel.string.length > 10){
            this.app.showAlert('密码错误！')
        }else{
            this.node.removeFromParent();
            this.fetchcheckPassword();
        }
    }

    fetchcheckPassword(){
        var url = `${this.app.UrlData.host}/api/user_funds_password/checkPassword?user_id=${this.app.UrlData.user_id}&password=${this.passwordLabel.string}&token=${this.app.token}`;
        fetch(url,{
            method:'GET',
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //验证成功，保存验证结果
                this.app.isTestPassworld = true;
                // type = 1,显示收付款信息
                //type =2 ,显示出售
                // type =6 ,确认赠送
                if(this.type == 1){
                    var self = this;
                    var timer = setTimeout(()=>{
                        self.app.showAccNum()
                        clearTimeout(timer);
                    },400)
                }else if(this.type == 2){
                    var self = this;
                    var timer = setTimeout(()=>{
                        self.app.showSellAlert()
                        clearTimeout(timer);
                    },400)
                }else if(this.type == 6){
                    var give = cc.find('Canvas/content/Give').getComponent('Give');
                    give.fetchGive();
                }

            }else{
                this.app.isTestPassworld = false;
                this.app.showAlert(data.msg)
            }
        })
    }
    deletePassword(){
        this.passwordLabel.string = '点击输入';
        this.app.setInputColor('',this.passwordLabel);
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
