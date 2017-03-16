'use strict';

const CNodeJS = require('./');

const client = new CNodeJS({});


console.log("=============getchallenge================")
client.getchallenge({})
    .then(ret => {
        console.log(ret);
        console.log("=============loginAction================")
        client.loginAction({}).then(ret => {
            console.log(ret);
            console.log("=============getlisttypes================")
            client.getlisttypes({}).then(ret => {
                console.log(ret);
                console.log("=============getDescribe================")
                client.getDescribe({}).then(ret => {
                    console.log(ret);
                    console.log("=============creatContacts================")
                    client.creatContacts({}).then(ret => {
                        console.log(ret);
                    })
                })
            })

        })
    })
    .catch(err => console.error(err));