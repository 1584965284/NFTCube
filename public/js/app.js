
const app = Vue.createApp({
    data() {
        return {
            account: 'no connect',
            if_connect: false,
            if_bind: false,
            web3: '',
            binder: {
                account: 'no bind',
                username: 'name',
                avatar: '/img/user_logo.jpg',
                description: 'description',
            },
            mint: {
                name:'Threezh1',
                description:'cool boy',
                labels:'cool,ice',
                author: 'sanzhi',
                file: {},
            },
            nftsOwn: [],
            nftsSold: []
        }
    },
    created() {
        let upper = this
        this.web3 = new Web3(window.ethereum)
        if (localStorage.getItem("connect") == 'true') {
            this.connect()
        }

        if (localStorage.getItem("bind") == 'true') {
            this.getUserInfo()
            this.getNFTOwn()
            this.getNFTSold()
        }

        window.ethereum.on('accountsChanged', function (accounts) {
            upper.account = accounts[0]
            if (accounts.length == 0) {
                localStorage.setItem("connect", false)
                upper.if_connect = false
            }
            localStorage.setItem("bind", false)
            localStorage.removeItem("token")
            upper.if_bind = false
            upper.binder = {
                account: 'no bind',
                username: 'name',
                avatar: '/img/user_logo.jpg',
                description: 'description',
            }
        });
    },
    methods:{
        async connect() {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                this.account = accounts[0];
                localStorage.setItem("connect", true);
                this.if_connect = true
            }catch{
                console.log('connect error')
            }
        },
        bind() {
            if (!this.if_connect) {
                alert("please connect metamask")
                return
            }
            axios
            .post('/api/login/getNonce', {
                "address": this.account
            })
            .then(response => {
                let nonce = response.data.nonce
                let msg = { "address": this.account, "nonce": nonce }
                let msg_hex = this.web3.utils.stringToHex(JSON.stringify(msg))
                let from = this.account

                let upper = this

                let method = 'personal_sign'
                var params = [msg_hex, from]

                this.web3.currentProvider.sendAsync({
                        method,
                        params,
                        from
                    },
                    function (err, result) {
                        if (err) {
                            return console.error(err)
                        }
                        let sign = result.result
                        console.log("SIGN:", sign, from)
                        upper.loginSign(sign, nonce)
                    }
                )
            })
        },
        loginSign(sign, nonce) {
            axios
            .post('/api/login/checkSign', {
                "address": this.account,
                "nonce": nonce,
                "sign": sign
            })
            .then(response => {
                if (response.status != 200) {
                    return
                }
                localStorage.setItem("bind", true);
                localStorage.setItem("token", response.data.token);
                this.bind = false
                this.getUserInfo()
                this.getNFTOwn()
                this.getNFTSold()
            })
        },
        getUserInfo() {
            let upper = this
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            axios({
                method: 'get',
                url: '/api/user/getUserInfo',
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then(function(response) {
                upper.binder = {
                    account: response.data.address,
                    username: response.data.username,
                    avatar: response.data.avatar,
                    description: response.data.description,
                }
            })
        },
        changeUserInfo() {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            axios({
                method: 'post',
                url: '/api/user/changeUserInfo',
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: {
                    username: this.binder.username,
                    avatar: this.binder.avatar,
                    description: this.binder.description,
                }
            })
            .then(function(response) {
                if (!response.data.errcode) {
                    alert("Change user info success")
                }
            })
        },
        uploadFile() {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            axios({
                method: 'post',
                url: '/api/user/uploadFile',
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: {
                    username: this.binder.username,
                    avatar: this.binder.avatar,
                    description: this.binder.description,
                }
            })
            .then(function(response) {
                if (!response.data.errcode) {
                    alert("upload file success")
                }
            })
        },
        getFile(event) {
            this.mint.file = event.target.files[0];
        },
        async submitMintForm(event) {
            event.preventDefault();

            let token = localStorage.getItem("token")
            if (!token){
                return
            }

            let formData = new FormData();
            formData.append('name', this.mint.name);
            formData.append('description', this.mint.description);
            formData.append('labels', this.mint.labels);
            formData.append('author', this.mint.author);
            formData.append('file', this.mint.file);

            const response = await axios({
                method: 'post',
                url: '/api/user/uploadFile',
                headers: {
                    "Authorization": "Bearer " + token,
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })
            if (response.status == 200) {
                this.mintSign(response.data)
            }
        },
        async getContractAddress() {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            const response = await axios({
                method: 'get',
                url: '/api/nft/getContractAddress',
                headers: {
                    "Authorization": "Bearer " + token
                },
            })
            return response.data.address
        },
        async mintSign(fileinfo){
            let upper = this
            const chainId = await this.web3.eth.getChainId()
            const contract_address = await this.getContractAddress()
            const tokenId = fileinfo.tokenId
            const url_ipfs = fileinfo.url_ipfs

            const msgParams = JSON.stringify({
                domain: {
                    name: "NFTCube-Voucher",
                    version: "1",
                    chainId: chainId,
                    verifyingContract: contract_address,
                },
                message: {
                    tokenId: tokenId,
                    url: url_ipfs,
                },
                primaryType: "NFTVoucher",
                types: {
                    EIP712Domain: [
                        {name: "name", type: "string"},
                        {name: "version", type: "string"},
                        {name: "chainId", type: "uint256"},
                        {name: "verifyingContract", type: "address"},
                    ],
                    NFTVoucher: [
                        {name: "tokenId", type: "uint256"},
                        {name: "url", type: "string"},
                    ]
                }
            })

            console.log(msgParams)
            this.web3.currentProvider.sendAsync({
                method: "eth_signTypedData_v3",
                params: [this.account, msgParams],
                from: this.account
            }, function(err, result) {
                if (err) {
                    return console.error(err)
                }
                if (result.error) {
                    console.log(result.error.message);
                }
                upper.mintNFT(result.result, tokenId)
            })
        },
        async mintNFT(signature, tokenId){
            console.log("SIGN", signature)
            console.log("tokenId", tokenId)

            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            const response = await axios({
                method: 'post',
                url: '/api/nft/mintNFT',
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: {
                    tokenId: tokenId,
                    signature: signature
                }
            })
            alert(response.data.msg)
            this.getNFTOwn()
            this.getNFTSold()
        },
        async getNFTOwn(){
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            const response = await axios({
                method: 'get',
                url: '/api/nft/getNFTOwn',
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            this.nftsOwn = response.data.nfts
        },
        async getNFTSold(){
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            const response = await axios({
                method: 'get',
                url: '/api/nft/getNFTSold',
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            this.nftsSold = response.data.nfts
        },
        sign_action(action, msg) {
                return new Promise((resolve, reject) => {
                    let token = localStorage.getItem("token")
                    if (!token){
                        return
                    }
                    let sign_msg = { action: action, msg: msg }
                    let msg_hex = this.web3.utils.stringToHex(JSON.stringify(sign_msg))
                    let from = this.account

                    let method = 'personal_sign'
                    var params = [msg_hex, from]
                    this.web3.currentProvider.sendAsync({
                            method,
                            params,
                            from
                        },
                        function (err, result) {
                            if (err) {
                                reject(error)
                            }
                            let sign = result.result
                            console.log("SIGN:", sign, from)
                            resolve(sign)
                        }
                    )
                })
        },
        async open_sold(nft) {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }

            if (parseInt(nft.price) <= 0) {
                alert("Please set price")
                return
            }

            this.set_price(nft)

            const response = await axios({
                method: 'post',
                url: '/api/nft/openSold',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                data: {
                    tokenId: nft.tokenId
                }
            })
            if (response.data.errcode) {
                alert(response.data.msg)
                return
            }
            this.getNFTOwn()
            this.getNFTSold()
        },
        async close_sold(nft) {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            const response = await axios({
                method: 'post',
                url: '/api/nft/closeSold',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                data: {
                    tokenId: nft.tokenId
                }
            })
            if (response.data.errcode) {
                alert(response.data.msg)
                return
            }
            this.getNFTOwn()
            this.getNFTSold()
        },
        async set_price(nft) {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }
            const response = await axios({
                method: 'post',
                url: '/api/nft/setPrice',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                data: {
                    tokenId: nft.tokenId,
                    price: parseInt(nft.price)
                }
            })
            if (response.data.errcode) {
                alert(response.data.msg)
                return
            }
            this.getNFTOwn()
            this.getNFTSold()
        },
        open_nft(nft) {
            window.open(nft.url_cos,'target','');
        },
        buy_nft(nft) {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }

            axios({
                method: 'post',
                url: '/api/nft/buyNFT',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                data: {
                    tokenId: nft.tokenId
                }
            }).then(function(response) {
                if (response.data.errcode) {
                    alert(response.data.msg)
                    return
                }
                alert(response.data.msg)
            }).catch(function(error) {
                console.log(error)
                alert("Buy nft error")
            })

            this.getNFTOwn()
            this.getNFTSold()
        },
        delete_nft(nft) {
            let token = localStorage.getItem("token")
            if (!token){
                return
            }

            axios({
                method: 'post',
                url: '/api/nft/deleteNFT',
                headers: {
                    "Authorization": "Bearer " + token,
                },
                data: {
                    tokenId: nft.tokenId
                }
            }).then(function(response) {
                if (response.data.errcode) {
                    alert(response.data.msg)
                    return
                }
                alert(response.data.msg)
            }).catch(function(error) {
                console.log(error)
                alert("Buy nft error")
            })

            this.getNFTOwn()
            this.getNFTSold()
        },
        sign_nft(nft) {
            const fileinfo = {
                tokenId: nft.tokenId,
                url_ipfs: nft.url_ipfs
            }
            this.mintSign(fileinfo)
        }
    }
})

app.component('nft-own-element', {
    template: `
    <li>
        <img v-bind:src="img_url">
        <h4>{{name}}</h4>
        <p style="color: gray;">Author: {{author}}</p>
        <p>{{description}}</p>
        <p>TokenId:{{tokenid}}</p>
        <p>Creater:{{creater}}</p>
        <p>Owner:{{owner}}</p>
        <p>
            Price:<input type="number" :value="price" @input="$emit('update:price', $event.target.value)">
            <button v-on:click="$emit('set_price')">设置价格</button>
            </p>
        <button v-on:click="$emit('open_sold')" v-bind:disabled="open_sold_disabled">开启售卖</button>&nbsp;
        <button v-on:click="$emit('close_sold')" v-bind:disabled="close_sold_disabled">关闭售卖</button>&nbsp;
        <button v-on:click="$emit('delete_nft')">删除NFT</button>&nbsp;
        <button v-on:click="$emit('sign_nft')" v-bind:disabled="sign_nft_disabled">签名</button>
    </li>
    `,
    props: ['img_url', 'name', 'author', 'description', 'tokenid', 'creater', 'owner', 'price', 'open_sold_disabled', 'close_sold_disabled', 'sign_nft_disabled'],
    emits: ['set_price', 'open_sold', 'close_sold', 'delete_nft', 'sign_nft', 'update:price']
})

app.component('nft-sold-element', {
    template: `
    <li>
        <img v-bind:src="img_url">
        <h4>{{name}}</h4>
        <p style="color: gray;">Author: {{author}}</p>
        <p>Price:{{price}}</p>
        <p>{{description}}</p>
        <p>TokenId:{{tokenid}}</p>
        <p>Creater:{{creater}}</p>
        <p>Owner:{{owner}}</p>
        <button v-on:click="$emit('open_nft')">查看详情</button>&nbsp;
        <button v-on:click="$emit('buy_nft')">购买</button>
    </li>
    `,
    props: ['img_url', 'name', 'author', 'description', 'tokenid', 'creater', 'owner', 'price'],
    emits: ['open_nft', 'buy_nft']
})

app.mount('#app')
