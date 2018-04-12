package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.naming.NamingException;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dataObjects.PrivateStringObject;
import dataObjects.eventObject;

@Controller
public class userLoginController extends indexController{

	public userLoginController() throws NamingException {
		super();
	}
	
	
	@RequestMapping("/getActiveEvents")
	@ResponseBody
	public String getActiveEvents() throws ClassNotFoundException, SQLException, JsonProcessingException{
		
		ResultSet rs;
		String jsonString ="";
		List<eventObject> evList = new ArrayList<eventObject>();
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("select id,name,description,created_on from event where is_active = true order by created_on DESC");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				rs = pst.executeQuery();
				while(rs.next()){
					evList.add(new eventObject(rs.getInt("id"),rs.getString("name"),rs.getString("description"),true,rs.getDate("created_on").getTime(),""));
				}
				return mapper.writeValueAsString(evList);
			}
		}
		return jsonString;
	}

	
	@RequestMapping(value="/loginUser", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String loginUser(@RequestBody PrivateStringObject accessCode) throws ClassNotFoundException, SQLException, JsonProcessingException{
		ResultSet rs;
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("select id,name,description from event where access_code = ? and is_active = true");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setString(1, accessCode.getSecretString());
				rs = pst.executeQuery();
				if(rs.next()){
					eventObject event = new eventObject(rs.getInt("id"), rs.getString("name"), rs.getString("description"), true);
					return mapper.writeValueAsString(event);
				}
				return "";
			}
		}
		return "";
	}
}
