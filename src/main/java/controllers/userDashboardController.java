package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.naming.NamingException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dataObjects.tagEmoPercentObject;

@Controller
public class userDashboardController extends indexController{

	public userDashboardController() throws NamingException {
		super();
	}
	
	@RequestMapping("/allTagPercents")
	@ResponseBody
	public String getAllTagPercents(@RequestParam(value="eventId") Long eventId) throws ClassNotFoundException, SQLException, JsonProcessingException {

		try (Connection con = db.getConnection()) {
			if (con != null) {
				ResultSet rs;
				List<tagEmoPercentObject> listOfAllTagPercents = new ArrayList<>();
				StringBuilder percentQuery = new StringBuilder(
						"select id,name,description,coalesce(totalCount,0) as total,coalesce(upsetCount,0) as upset ,coalesce(sadCount,0) as sad ,coalesce(neutralcount,0) as neutral ,coalesce(hapCount,0) as hap,coalesce(gladCount,0) as glad");
				percentQuery.append(" from (select * from tag where event_id = ?) as tagTab");
				percentQuery.append(
						" left join (select count(id) as totalCount ,tag_id  from xpression group by tag_id) as totalTab on tagTab.id = totalTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as upsetcount,tag_id from xpression where sentiment <1 group by tag_id) as upsetTab on tagTab.id = upsetTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as sadcount,tag_id from xpression where sentiment =1 group by tag_id) as sadTab on tagTab.id = sadTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as neutralcount,tag_id from xpression where sentiment =2 group by tag_id) as neutralTab on tagTab.id = neutralTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as hapcount,tag_id from xpression where sentiment =3 group by tag_id) as hapTab on tagTab.id = hapTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as gladcount,tag_id from xpression where sentiment =4 group by tag_id) as gladTab on tagTab.id = gladTab.tag_id");
				percentQuery.append(" ORDER BY total DESC;");

				PreparedStatement pstPercent = con.prepareStatement(percentQuery.toString());
				pstPercent.setLong(1,eventId);
				//System.out.println(percentQuery.toString());
				rs = pstPercent.executeQuery();
				while (rs.next()) {
					listOfAllTagPercents.add(new tagEmoPercentObject(rs.getInt("id"), rs.getString("name"),
							rs.getString("description"), rs.getInt("total"), rs.getInt("upset"), rs.getInt("sad"),
							rs.getInt("neutral"), rs.getInt("hap"), rs.getInt("glad")));
				}
				con.close();
				return mapper.writeValueAsString(listOfAllTagPercents);
			} else {
				return "";
			}
		}
	}
	
	@RequestMapping("/getEventNameFromId")
	@ResponseBody
	public String getEventNameFromId(@RequestParam(value="eventId") Long eventId) throws ClassNotFoundException, SQLException{
		String jsonString ="";
		try(Connection con = db.getConnection()){
			if(con!=null){
				ResultSet rs;
				StringBuilder sb = new StringBuilder("select name from event where id = ? ");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setLong(1, eventId);
				rs = pst.executeQuery();
				if(rs.next()){
					return "[\"" + rs.getString("name") + "\"]";
				}
			}
			
		}
		
		
		return jsonString;
	}
}
