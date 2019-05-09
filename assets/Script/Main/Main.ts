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

    @property(cc.Label)
    public pageLabel : cc.Label = null;

    @property
    public results = null;
    public page = 1;
    public isReceive = false;
    protected onLoad(): void {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.fetchIndex();
    }

    public fetchIndex(){
        var url = `${this.app.UrlData.host}/api/sell_gold/sellGoldList?page=${this.page}&page_set=8&token=${this.app.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            this.mainList.removeAllChildren();
            if (data.status == 0) {
                this.results = data;
                this.init();
            } else {
                this.app.showAlert(data.msg);
            }
        })
    }

    public  init(){
        this.pageLabel.string = `${this.page} / ${Number(this.results.data.total_page) == 0 ? '1' : this.results.data.total_page}`;
        for(let i = 0 ;i<this.results.data.list.length; i++){
            var node = cc.instantiate(this.mainItem);
            this.mainList.addChild(node);
            var data = this.results.data.list[i];
            node.getComponent('MainItem').init(data)
        }
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
