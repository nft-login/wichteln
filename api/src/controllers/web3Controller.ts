import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import * as EarlyAccessGame from "../abis/EarlyAccessGame.json";
import { Get, Route, Path } from "tsoa";

const CONTRACT = process.env.CONTRACT;
const NODE_PROVIDER = process.env.NODE_PROVIDER || "";

export class Web3Blockchain {

    private static _instance: Web3Blockchain;

    web3?: Web3;
    contract?: any;

    constructor() {
        this.init();
    }

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    init = async () => {
        this.web3 = new Web3(NODE_PROVIDER);
        this.contract = new this.web3.eth.Contract(EarlyAccessGame.abi as AbiItem[], CONTRACT);
        this.contract.setProvider(NODE_PROVIDER);
    }

    tokenCount = (): Promise<number> => {
        return this.contract.methods.totalSupply().call();
    };

    ownerOf = async (tokenId: number) => {
        let owner = await this.contract.methods.ownerOf(tokenId).call();
        return [tokenId, owner];
    };

    tokensOf = async (account: String) => {
        let count = await this.tokenCount();
        let promises = []
        for (let i = 0; i < count; i++) {
            promises.push(this.ownerOf(i));
        }
        let owners = await Promise.all(promises);
        let accountTokens: String[] = []
        owners.forEach(o => {
            if (
                o[1] === account
            ) {
                accountTokens.push(o[0]);
            }
        })
        return accountTokens;
    }
}

@Route("token")
export class Web3Controller {

    @Get("count")
    public async count(
    ): Promise<any> {
        return Web3Blockchain.getInstance().tokenCount();
    }

    /**
     * @example tokenId "2"
     */
     @Get("owner/{tokenId}")
     public async owner(
         @Path() tokenId: number
     ): Promise<String> {
         return (await Web3Blockchain.getInstance().ownerOf(tokenId))[1];
     }

     @Get("account/{account}")
    public async account(
        @Path() account: string
    ): Promise<String[]> {
        return (await Web3Blockchain.getInstance().tokensOf(account));
    }
}

export default Web3Blockchain.getInstance;