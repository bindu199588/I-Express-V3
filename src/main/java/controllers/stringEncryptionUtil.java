package controllers;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import dataObjects.PrivateStringObject;

@Controller
public class stringEncryptionUtil {
	
	private static final String encryptionKey           = "@PASS_I-Express@";
    private static final String characterEncoding       = "UTF-8";
    private static final String cipherTransformation    = "AES/CBC/PKCS5PADDING";
    private static final String aesEncryptionAlgorithem = "AES";
	@RequestMapping(value = "/encryptString",  produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String encryptString(@RequestBody PrivateStringObject plainString){
		String encryptedString = "";
		try {
            Cipher cipher   = Cipher.getInstance(cipherTransformation);
            byte[] key      = encryptionKey.getBytes(characterEncoding);
            SecretKeySpec secretKey = new SecretKeySpec(key, aesEncryptionAlgorithem);
            IvParameterSpec ivparameterspec = new IvParameterSpec(key);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivparameterspec);
            byte[] cipherText = cipher.doFinal(plainString.getSecretString().getBytes(characterEncoding));
            
            //System.out.write(cipherText);
            
            Base64.Encoder encoder = Base64.getEncoder();
            encryptedString = new String(encoder.encode(cipherText),characterEncoding);
            
            //System.out.write(encoder.encode(cipherText));
            //System.out.println(encryptedString);
            
            
        } catch (Exception E) {
             System.err.println("Encrypt Exception : "+E.getMessage());
        }
		return encryptedString;
	}
	
	@RequestMapping(value = "/decryptString", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String decryptString(@RequestBody PrivateStringObject encryptedString){
		String decryptedString = "";
		try {
			
            Cipher cipher = Cipher.getInstance(cipherTransformation);
            byte[] key = encryptionKey.getBytes(characterEncoding);
            SecretKeySpec secretKey = new SecretKeySpec(key, aesEncryptionAlgorithem);
            IvParameterSpec ivparameterspec = new IvParameterSpec(key);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivparameterspec);
            Base64.Decoder decoder = Base64.getDecoder();
            
            //System.out.write(encryptedString.getBytes(characterEncoding));
            
            byte[] cipherText = decoder.decode(encryptedString.getSecretString().getBytes(characterEncoding));
            decryptedString = new String(cipher.doFinal(cipherText), characterEncoding);

        } catch (Exception E) {
            System.err.println("decrypt Exception : "+E.getMessage());
        }
		return decryptedString;
	}
}
