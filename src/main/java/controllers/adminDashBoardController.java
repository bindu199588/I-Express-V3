package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.naming.NamingException;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import dataObjects.countAtDateObject;
import dataObjects.eventAgendaObject;
import dataObjects.eventObject;
import dataObjects.tagObject;
import dataObjects.userLoginObject;

@Controller
public class adminDashBoardController extends indexController{

	public adminDashBoardController() throws NamingException {
		super();
	}
	
	@RequestMapping("/postNewEvent")
	@ResponseBody
	public String createEvent(@RequestParam(value = "name") String name,@RequestParam(value = "description") String description) throws ClassNotFoundException, SQLException{
		
		String jsonString ="";
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("insert into event(name,description,access_code) values(?,?,access_code())");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setString(1,name);
				pst.setString(2, description);
				Integer rowCount = pst.executeUpdate();
				return rowCount.toString();
			}
		}
		return jsonString;
	}

	@RequestMapping(value="/postNewTag", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public boolean createTag(@RequestBody List<tagObject> tagsList) throws ClassNotFoundException, SQLException{
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("insert into tag(name,description,event_id) values(?,?,?)");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				//Iterator tagIt = tagsList.iterator();
				for(tagObject tagObj : tagsList){
					pst.setString(1,tagObj.getName());
					pst.setString(2, tagObj.getDescription());
					pst.setLong(3, tagObj.getEvent_id());
					pst.executeUpdate();
				}
				return true;
			}
		}
		return false;
	}
	
	@RequestMapping(value = "/postEventAgenda", produces=MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public boolean addEventAgenda(@RequestBody List<eventAgendaObject> agendaList) throws ClassNotFoundException, SQLException{
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("insert into eventagenda(agenda,start_time,end_time,event_id) values(?,?,?,?)");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				for(eventAgendaObject agendaObject : agendaList){
					pst.setString(1, agendaObject.getAgenda());
					pst.setTimestamp(2, new java.sql.Timestamp(agendaObject.getStart_time()));
					pst.setTimestamp(3, new java.sql.Timestamp(agendaObject.getEnd_time()));
					pst.setLong(4, agendaObject.getEvent_id());
					pst.executeUpdate();
				}
				return true;
			}
		}
		return false;
	}
	
	@RequestMapping(value = "/loadEventAgenda")
	@ResponseBody
	public String getEventAgenda(@RequestParam(value="event_id") Long eventId) throws ClassNotFoundException, SQLException, JsonProcessingException{
		try(Connection con = db.getConnection()){
			if(con!=null){
				ResultSet rs;
				List<eventAgendaObject> agendaList = new ArrayList<eventAgendaObject>();
				StringBuilder sb = new StringBuilder("select * from eventagenda where event_id = ? order by start_time");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setLong(1,eventId);
				rs = pst.executeQuery();
				while(rs.next()){
					agendaList.add(new eventAgendaObject(rs.getInt("id"),rs.getString("agenda"),rs.getTimestamp("start_time").getTime(),rs.getTimestamp("end_time").getTime(),rs.getLong("event_id"),0L));
				}
				return mapper.writeValueAsString(agendaList);
			}
		}
		return "";
	}
//	@RequestMapping("/updateEvent")
//	@ResponseBody
//	public String updateEvent(@RequestParam(value = "name") String name,@RequestParam(value = "description") String description,@RequestParam(value = "is_active") Boolean is_active,@RequestParam(value = "eventId") int eventId) throws ClassNotFoundException, SQLException{
//		
//		String jsonString ="";
//		try(Connection con = db.getConnection()){
//			if(con!=null){
//				StringBuilder sb = new StringBuilder("update event set name =?,description =?,is_active =? where id =?");
//				PreparedStatement pst = con.prepareStatement(sb.toString());
//				pst.setString(1,name);
//				pst.setString(2, description);
//				pst.setBoolean(3, is_active);
//				pst.setInt(4, eventId);
//				Integer rowCount = pst.executeUpdate();
//				return rowCount.toString();
//			}
//		}
//		return jsonString;
//	}
//	@RequestMapping("/updateTag")
//	@ResponseBody
//	public String updateTag(@RequestParam(value = "name") String name,@RequestParam(value = "description") String description,@RequestParam(value = "eventId") Long eventId,@RequestParam(value = "tagId") int tagId) throws ClassNotFoundException, SQLException{
//		
//		String jsonString ="";
//		try(Connection con = db.getConnection()){
//			if(con!=null){
//				StringBuilder sb = new StringBuilder("update tag set name =?,description =? where id =? and event_id =?");
//				PreparedStatement pst = con.prepareStatement(sb.toString());
//				pst.setString(1,name);
//				pst.setString(2, description);
//				pst.setInt(3,tagId);
//				pst.setLong(4, eventId);
//				Integer rowCount = pst.executeUpdate();
//				return rowCount.toString();
//			}
//		}
//		return jsonString;
//	}
	
	@RequestMapping("/disableEvent")
	@ResponseBody
	public String disableEvent(@RequestParam(value = "eventId") Long eventId,@RequestParam(value = "is_active") Boolean is_active) throws ClassNotFoundException, SQLException{
		
		String jsonString ="";
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("update event set is_active = ? where id = ?");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setBoolean(1, is_active);
				pst.setLong(2, eventId);				
				Integer rowCount = pst.executeUpdate();
				return rowCount.toString();
			}
		}
		return jsonString;
	}
	
	
	@RequestMapping("/getAllEvents")
	@ResponseBody
	public String getAllEvents() throws ClassNotFoundException, SQLException, JsonProcessingException{
		ResultSet rs;
		String jsonString ="";
		List<eventObject> evList = new ArrayList<eventObject>();
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("select id,name,description,is_active,created_on,access_code from event order by is_active DESC,created_on DESC");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				rs = pst.executeQuery();
				while(rs.next()){
					evList.add(new eventObject(rs.getInt("id"),rs.getString("name"),rs.getString("description"),rs.getBoolean("is_active"),rs.getDate("created_on").getTime(),rs.getString("access_code")));
				}
				return mapper.writeValueAsString(evList);
			}
		}
		return jsonString;
	}	
	
	@RequestMapping("/getTagsFromEventId")
	@ResponseBody
	public String getTagsFromEventId(@RequestParam(value = "eventId") Long eventId)
			throws ClassNotFoundException, SQLException, JsonProcessingException {
		
		ResultSet rs;
		String jsonString ="";	
		List<tagObject> tagsList = new ArrayList<tagObject>();
		
		try(Connection con = db.getConnection()){
			if(con!=null){
				StringBuilder sb = new StringBuilder("select * from tag where event_id =?");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				pst.setLong(1, eventId);
				rs = pst.executeQuery();
				while(rs.next()){
					tagsList.add(new tagObject(rs.getInt("id"),rs.getString("name"),rs.getDate("created_on").getTime(),rs.getString("description"),rs.getLong("event_id")));
				}
				return mapper.writeValueAsString(tagsList);
			}
		}
		return jsonString;
	}
	
//	
//	@RequestMapping("/deleteTagFromEvent")
//	@ResponseBody
//	public String deleteTagFromEvent(@RequestParam(value = "eventId") Long eventId,@RequestParam(value = "tagId") int tagId)
//			throws ClassNotFoundException, SQLException, JsonProcessingException {
//		
//		String jsonString ="";
//		try(Connection con = db.getConnection()){
//			if(con!=null){
//				StringBuilder sb = new StringBuilder("delete from tag where event_id =? and id = ?");
//				PreparedStatement pst = con.prepareStatement(sb.toString());
//				pst.setLong(1, eventId);
//				pst.setInt(2, tagId);
//				Integer rowCount = pst.executeUpdate();
//				return rowCount.toString();
//			}
//		}
//		return jsonString;
//	}
//	
	
	@RequestMapping("/getEventGraphData")
	@ResponseBody
	public String getEventGraphData(@RequestParam(value="eventId") Long eventId,@RequestParam(value="tagId",required = false) Integer tagId) throws ClassNotFoundException, SQLException, JsonProcessingException {
		
		ResultSet rs;
		String jsonString ="";		
		try(Connection con = db.getConnection()){
			if(con!=null){		
				StringBuilder sb = new StringBuilder("select count(xprJoin.id),myDate.date");
				sb.append(" from ");
				sb.append(" (select distinct date(created_on) from xpression ");
				sb.append(" join ");
				sb.append(" (select id,event_id from tag where event_id = ? ");
				if(tagId != null){
					sb.append("and id =? ");
				}
				sb.append(") as tagTable on tagTable.id = tag_id");
				sb.append(" order by date) as myDate ");
				sb.append(" left join ");
				sb.append(" (select xpression.id,created_on from xpression join (select id,event_id from tag where event_id =? ");
				if(tagId != null){
					sb.append("and id =? ");
				}
				sb.append(") as tagJoin on tagJoin.id=tag_id where xpression.sentiment = ?) as xprJoin ");
				sb.append(" on myDate.date >= date(xprJoin.created_on) ");
				sb.append(" group by myDate.date;");
				PreparedStatement pst = con.prepareStatement(sb.toString());
				
				int sentiment = 0;
				countAtDateObject cb;
				List<List<countAtDateObject>> totalList= new ArrayList<>();
				List<countAtDateObject> countAtDateListForEachSentiment;
				
				for(sentiment = 0;sentiment<5;sentiment++){
					countAtDateListForEachSentiment = new ArrayList<countAtDateObject>();
					if(tagId!=null){
						pst.setLong(1, eventId);
						pst.setInt(2, tagId);
						pst.setLong(3, eventId);
						pst.setInt(4, tagId);
						pst.setInt(5, sentiment);
					}
					else{
						pst.setLong(1, eventId);						
						pst.setLong(2, eventId);
						pst.setInt(3, sentiment);
					}
					//System.out.println(pst.toString());
					rs = pst.executeQuery();
					while(rs.next()){
						cb = new countAtDateObject(rs.getLong("count"),rs.getDate("date").getTime());
						countAtDateListForEachSentiment.add(cb);
					}
					totalList.add(countAtDateListForEachSentiment);
				}
				return mapper.writeValueAsString(totalList);
			}
		}
		return jsonString;
	}
	
}
