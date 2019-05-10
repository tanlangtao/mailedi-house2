// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Config from "../lib/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    TradeItem: cc.Prefab = null;

    @property(cc.Label)
    pageLabel: cc.Label = null;

    @property(cc.Node)
    saleGoldList: cc.Node = null;

    @property
    public results = null;
    public FormData = new FormData();
    public page = 1;
    public app  = null;
    public status = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.app = cc.find('Canvas').getComponent('Canvas');

        this.fetchIndex();
    }

    public fetchIndex() {

        var url = `${this.app.UrlData.host}/api/sell_gold/userSellGoldOrderList?&user_id=${this.app.UrlData.user_id}&status=${this.status}&page=${this.page}&page_set=8&token=${this.app.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            this.saleGoldList.removeAllChildren();
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
            var node = cc.instantiate(this.TradeItem);
            this.saleGoldList.addChild(node);
            var data = this.results.data.list[i];
            node.getComponent('TradeItem').init(data)
        }
    }
    //全部
    toggle1Click(){
        this.status = 0;
        this.fetchIndex();
    }
    //未完成
    toggle2Click(){
        this.status = 2;
        this.fetchIndex();
    }
    //已完成
    toggle3Click(){
        this.status = 6;
        this.fetchIndex();
    }

    pageUp(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.fetchIndex();
        }
    }

    pageDown(){
        let totalPage = Number(this.results.data.total_page);
        if(this.page < totalPage){
            this.page = this.page + 1;
            this.fetchIndex();
        }
    }

    removeSelf() {
        this.node.destroy();
    }

    onClick() {

    }

    // update (dt) {}
}
