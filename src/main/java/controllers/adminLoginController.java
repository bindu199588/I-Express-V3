package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.naming.NamingException;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dataObjects.adminLoginObject;

@Controller
public class adminLoginController  extends indexController {
	public adminLoginController() throws NamingException {
		super();
	}
	
	
	@RequestMapping(value= "/loginAdmin", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public boolean loginAdmin(@RequestBody adminLoginObject loginObject) throws ClassNotFoundException, SQLException, JsonProcessingException{
		
		ResultSet rs;
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("select password = ? as match from admin where username = ? ");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setString(1, loginObject.getPassword());
				pst.setString(2, loginObject.getUsername());
				rs = pst.executeQuery();
				if(rs.next()){
					return rs.getBoolean("match");
				}
				return false;
			}
		}
		return false;
	}
}
