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
    protected onLoad(): void {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.fetchIndex();
    }

    public fetchIndex(){
    }

    accNumClick(){
        if(this.app.is_password == 1){
            this.app.showTestPasswordAlert(1)
        }else if (this.app.is_password == 0){
            this.app.showSetPasswordAlert(this)
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
