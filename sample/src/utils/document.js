import { reactive } from 'vue'
import { KeyPairs } from './keys';
import { createJWT, ES256KSigner, hexToBytes } from 'did-jwt';

export const document = reactive({
  location: "",
  uri: "",
  verified: false,
})

export const writeDoc = async ( jwk, controller="" ) => {
    // ! caution
    // DID Documents should have more freedom of choice 
    // of encryption method, authentication, and authoraization
    // at the choice of each individual.

  const reqBody = {
    publicKeyJwk : jwk,
    controller : controller
  };
    
  try {
    const response = await fetch('/host/v0/api/did', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }  
    const docurl = await response.json();
    return docurl;
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
}

export const verifyJWK = async () => {
  const key = KeyPairs.privateKey;
  console.log(key);
  const signer = ES256KSigner(hexToBytes(key,32))

  // Create a signed JWT
  const jwt = await createJWT(
    { aud: import.meta.env.VITE_DID_HOST_URL, name: 'Bob Smith' },
    { issuer: import.meta.env.VITE_DID_HOST_URL, signer },
    { alg: 'ES256K' }
  )

  const result = await fetch(
    '/host/v0/api/testdid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'jwt': jwt})
    }
  ).then( res => {
      console.log(res);
      return res.json();
  }).catch( err => {
      console.log(err);
      return { msg: 'error occured' };
  });
  
  return result;
}

export const removeDoc = async () => {
  console.log("remove!")
}