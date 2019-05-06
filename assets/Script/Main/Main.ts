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

    @property
    public app  = null;

    @property(cc.Prefab)
    public mainItem : cc.Prefab = null;

    @property(cc.Node)
    public mainList : cc.Node = null;

    @property
    public results = null;
    public page = 1;
    public isReceive = false;
    public is_password = null;
    public idx = 0;
    protected onLoad(): void {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.fetchIndex();
    }

    public fetchIndex(){
        var url = `${this.app.UrlData.host}/api/with_draw/index?user_id=${this.app.UrlData.user_id}&token=${this.app.token}`;
        fetch(url,{
            method:'get'
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.is_password = data.data.is_password;
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

    accNumClick(){
        console.log(this.is_password)
        if(this.is_password == 1){
            this.app.showAccNum();
            this.node.removeFromParent();
        }else if(this.is_password == 0){
            this.app.showSetPasswordAlert(this);
        }

    }

    giveClick(){
        this.app.showGive();
        this.node.removeFromParent();
    }

    updataList(){
        this.mainList.removeAllChildren();
        this.fetchIndex();
    }

    pageUp(){
        if(this.isReceive){
            if(this.page > 1){
                this.page = this.page - 1;
                this.updataList();
                this.isReceive = false;
            }
        }
    }

    pageDown(){
        if(this.isReceive){
            if(this.page < this.results.data.total_page){
                this.page = this.page + 1;
                this.updataList();
                this.isReceive = false;
            }
        }
    }
}
