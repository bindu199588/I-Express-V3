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
import dataObjects.eventObject;
import dataObjects.userLoginObject;

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
	public boolean loginUser(@RequestBody userLoginObject loginObject) throws ClassNotFoundException, SQLException, JsonProcessingException{
		ResultSet rs;
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("select access_code = ? as match from event where name = ? and id = ?");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setString(1, loginObject.getAccess_code());
				pst.setString(2, loginObject.getEventName());
				pst.setLong(3, loginObject.getEventId());
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
