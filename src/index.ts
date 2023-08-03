import web3 = require('@solana/web3.js')
import Dotenv from 'dotenv'

const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'


Dotenv.config()

async function main() {
    const newKeypair = web3.Keypair.generate()
    // console.log(newKeypair.secretKey.toString())
    const payer  = initislizeKeypair()
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    
    //to solve the error
    await connection.requestAirdrop(payer.publicKey , web3.LAMPORTS_PER_SOL*1)

    // we will invoke the ping function after we will write and add the instruction in the ping function

    await pingProgram(connection , payer)
}

async function pingProgram(connection: web3.Connection , payer: web3.Keypair){
    // create transaction
    const transaction = new web3.Transaction()
    const programId = new web3.PublicKey(PROGRAM_ADDRESS)
    const programDataPubkey =  new web3.PublicKey(PROGRAM_DATA_ADDRESS)
    // create an instruction

    const instruction = new web3.TransactionInstruction({
        keys:[
            {
                pubkey: programDataPubkey,
                isSigner : false,
                isWritable: true

            },
        ],
        programId
    })

    // adding the instruction

    const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )
    console.log(signature)
    console.log("it is successfully loaded")
    // create the instruction to the transaction
    // send the transaction
}

main().then(() => {
    console.log("Finished successfully")
}).catch((error) => {
    console.error(error)
})


function initislizeKeypair():web3.Keypair{
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    return keypairFromSecretKey

}