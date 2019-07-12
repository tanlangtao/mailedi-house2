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

    @property()
    public app: any = '';
    public params: any = '';
    public client: any = '';
    public listenHandler: any = '';
    public eventMap: any = '';
    public ok: any = '';
    public queue: any = [];
    public _t: any = '';

    constructor() {
        super();
        this.params = this.getParams();
        this.eventMap = {};
        this.onMessage();
        this.queue = [];
        this.ok = false;
        this.ping();
    }

    getParams() {
        let p = {};
        let params = window.location.search.slice(1);
        params.split("&").forEach(e => {
            let v = e.split("=");
            p[v[0]] = v[1];
        });
        return p;
    }

    push(message) {
        let client = window['ReactNativeWebView'] || window.parent;
        try {
            client.postMessage(message, "*");
        } catch (error) {
            client.postMessage(message);
        }
    }

    ping() {
        this._t = setInterval(() => {
            this.push(JSON.stringify({ type: "ping", data: {} }));
        }, 500);
    }

    pong() {
        this.ok = true;
        clearInterval(this._t);
    }

    ready() {
        while (this.queue.length > 0) {
            let message = this.queue.shift();
            this.send(message.type, message.data, message.fn);
        }
    }

    addEventListener(eventName, fn) {
        this.eventMap[eventName] = fn;
    }

    removeEventListener(eventName) {
        delete this.eventMap[eventName];
    }

    send(eventName, data, fn) {
        if (!this.ok) {
            return this.queue.push({
                type: eventName,
                data: data,
                fn: fn
            });
        }

        let message = {
            type: eventName,
            data: data
        };

        this.push(JSON.stringify(message));

        fn && fn();

        return;
    }

    onMessage() {
        [window.document, window].forEach(handler => {
            handler.addEventListener(
                "message",
                (e:any) => {
                    try {
                        let message = JSON.parse(e.data);

                        if (message.type === "pong") {
                            this.pong();
                            this.ready();
                            return;
                        }

                        if (this.eventMap[message.type]) {
                            return this.eventMap[message.type](message, this.app);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                false
            );
        });
    }
}