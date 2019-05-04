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
    ReceiveHistory: cc.Prefab = null;

    @property(cc.Prefab)
    GiveItem: cc.Prefab = null;

    @property(cc.EditBox)
    IdInput: cc.EditBox = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Label)
    pageLabel: cc.Label = null;

    @property(cc.Prefab)
    SelectItem: cc.Prefab = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property(cc.Node)
    GiveHistoryList: cc.Node = null;

    @property
    public showSelect = false;
    public results = null;
    public current = 1;
    public data: any = {};
    public FormData = new FormData();
    public page = 1;
    public isReceive = false;
    public app = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.app = cc.find('Canvas').getComponent('Canvas');

        this.data = ['全部','未完成','已完成'];

        this.initRender();

        this.app.getPublicInput(this.IdInput,1);

        this.fetchIndex();
    }

    start() {

    }

    selectClick() {
        if (!this.showSelect) {
            for (var i = 0; i < this.data.length; i++) {
                var node = cc.instantiate(this.SelectItem);
                this.selectContent.addChild(node);
                node.getComponent('GiveSelectItem').init({
                    text: this.data[i],
                    parentComponent: this,
                    index: i
                })
            }
            this.showSelect = true;
        } else {
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }

    public fetchIndex() {

        var url = `${this.app.UrlData.host}/api/give/myGiveList?type=1&status=${this.current}&user_id=${this.app.UrlData.user_id}&given_id=${this.IdInput.string == '' ? '0' :this.IdInput.string}&page=${this.page}&page_set=5&token=${this.app.token}`;
        fetch(url, {
            method: 'get'
        }).then((data) => data.json()).then((data) => {
            this.GiveHistoryList.removeAllChildren();
            if (data.status == 0) {
                this.results = data;
                this.init();

            } else {
                this.app.showAlert(data.msg)
            }
            //收到结果后才能点击搜索，上下翻页，避免页面错乱
            this.isReceive = true;
        })
    }

    init(){
        this.pageLabel.string = `${this.page} / ${this.results.data.total_page == 0 ?'1' :this.results.data.total_page}`;
        for(let i = 0 ;i < this.results.data.list.length ;i++){
            let data = this.results.data.list[i];
            let node = cc.instantiate(this.GiveItem);
            this.GiveHistoryList.addChild(node);
            node.getComponent('GiveItem').init(data);
        }
    }

    //selectItem回调
    public initRender() {
        this.selectLabel.string = this.data[this.current];
    }
    ReceiveClick() {
        if(this.isReceive){
            this.node.destroy();
            this.app.showReceiveHistory();
            this.isReceive = false;
        }

    }
    deleteId(){
        this.IdInput.string = '';
    }

    pageUp(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.fetchIndex();
            this.isReceive = false;
        }
    }

    pageDown(){
        if(this.page < this.results.data.total_page){
            this.page = this.page + 1;
            this.fetchIndex();
            this.isReceive = false;
        }

    }

    removeSelf() {
        this.node.destroy();
        this.app.showGive();
    }

    onClick() {
       if(this.isReceive){
           this.page = 1;
           this.fetchIndex();
           this.isReceive = false;
       }
    }

    // update (dt) {}
}
