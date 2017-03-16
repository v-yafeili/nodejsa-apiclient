'use strict';

const rawRequest = require('request');
const crypto = require('crypto');
const querystring = require("querystring");

class CNodeJS {

    constructor(options) {
        this.options = options = options || {};
        options.token = options.token || null;
        options.url = options.url || 'http://gogo.local.com/webservice.php';

    }

    baseParams(params) {

        params = Object.assign({}, params || {});
        if (this.options.sessionName) {
            params.sessionName = this.options.sessionName;
        }

        return params;

    }

    request(method, path, params, callback) {
        return new Promise((_resolve, _reject) => {

            const resolve = ret => {
                _resolve(ret);
                callback && callback(null, ret);
            };

            const reject = err => {
                _reject(err);
                callback && callback(err);
            };

            const opts = {
                method: method.toUpperCase(),
                url: this.options.url + path,
                headers:
                {
                    "content-type": 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            };
            console.log(this.baseParams(params));
            if (opts.method === 'GET' || opts.method === 'HEAD') {
                opts.qs = this.baseParams(params);
            } else {
                opts.body = querystring.stringify(this.baseParams(params));
            }
            console.log(opts);
            rawRequest(opts, (err, res, body) => {

                if (err) return reject(err);
                console.log(body);
                let result = JSON.parse(body);
                //console.log(result);
                if (result.success) {
                    resolve(result);
                } else {
                    //reject('dsfds')
                    reject(result);
                }

            });

        });
    }

    getchallenge(params, callback) {
        params = Object.assign({}, params, { operation: "getchallenge", username: "admin" })
        return this.request('GET', '', params, callback)
            .then(ret => {
                this.options.token = ret.result.token;
                Promise.resolve(ret)
            });
    }

    loginAction(params, callback) {
        let userAccessKey = 'CGH5QhU8xBb3mSS';
        console.log(this.options.token);
        console.log(this.options.token + userAccessKey);
        let accessKey = crypto.createHash('md5').update(this.options.token + userAccessKey).digest('hex');
        params = Object.assign({}, params, { operation: "login", username: "admin", accessKey: accessKey });
        let qstr = querystring.stringify(params);
        return this.request('POST', '', params, callback)
            .then(ret => {
                this.options.sessionName = ret.result.sessionName;
                this.options.userId =ret.result.userId;
                Promise.resolve(ret)
            });
    }

    getlisttypes(params, callback) {
        params = Object.assign({}, params, { operation: "listtypes", username: "admin" })
        return this.request('GET', '', params, callback)
            .then(ret => {
                Promise.resolve(ret)
            });
    }

    getDescribe(params, callback) {
        params = Object.assign({}, params, { operation: "describe", elementType: "Contacts" })
        return this.request('GET', '', params, callback)
            .then(ret => {
                Promise.resolve(ret)
            });
    }

    creatContacts(params,callback) {
        let element ={"lastname":"测试","assigned_user_id": this.options.userId}
        params = Object.assign({}, params, { operation: "create", elementType: "Contacts" ,element:JSON.stringify(element)})
        return this.request('POST', '', params, callback)
            .then(ret => {
                Promise.resolve(ret)
            });
    }

}

module.exports = CNodeJS;