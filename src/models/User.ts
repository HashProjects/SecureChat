import { v4 as uuid } from "uuid";
import {DSA_PRIVATE_KEY, DSA_PUBLIC_KEY, PRIVATE_KEY, PUBLIC_KEY} from "../handlers/auth/helpers";
const NodeRSA = require('node-rsa');
const rs = require('jsrsasign');

class User {
  public name: string;
  public id: string;
  public publicKey: string;
  public publicKeyType: string;
  constructor(username: string, publicKey: string, publicKeyType: string, id?: string) {
    this.name = username;
    this.id = (!id) ? uuid() : id;
    this.publicKey = publicKey;
    this.publicKeyType = publicKeyType;
  }

  toString() {
    return `${this.name}<${this.id}>`;
  }

  encryptSymmetricKey(symmetricKey: string, iv: string) : string {
    const concat = symmetricKey + iv;

    // sign concatenated symmetricKey and iv with server private key
    // encrypt with client public key.  Internal structure:
    //  1. concatenated symmetricKey and iv
    //  2. signature

    const pubUser = new NodeRSA();
    pubUser.importKey(this.publicKey);
    var signature: string;

    if (this.publicKeyType == 'rsa') {
      const keyServer = new NodeRSA();
      keyServer.importKey(PRIVATE_KEY, 'pkcs1');
      signature = keyServer.sign(concat, 'hex', 'hex');

      // check the signature using the public key
      const pubServer = new NodeRSA();
      pubServer.importKey(PUBLIC_KEY, 'public');
      const verified = pubServer.verify(concat, signature, 'hex', 'hex');
      console.log("verified = " + verified);

    } else {
      const sig = new rs.Signature({alg: 'SHA256withDSA'});
      sig.init(DSA_PRIVATE_KEY.toString())
      sig.updateString(concat);
      signature = sig.sign();

      const sig2 = new rs.Signature({alg: 'SHA256withDSA'});
      sig2.init(DSA_PUBLIC_KEY.toString());
      sig2.updateString(concat);
      var isValid = sig2.verify(signature);
      console.log("Attempting DSA: " + isValid);
    }
    console.log("signature: " + signature);

    const structure = concat + signature;
    const encryptedKey = pubUser.encrypt(structure, 'base64', 'hex');
    console.log("encryptedKey2 = " + encryptedKey);

    // check the signature using the public key
    const pubServer = new NodeRSA();
    pubServer.importKey(PUBLIC_KEY, 'public');
    const verified = pubServer.verify(concat, signature, 'hex', 'hex');
    console.log("verified = " + verified);

    return encryptedKey;

  }
}

export default User;
