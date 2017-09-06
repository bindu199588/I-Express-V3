package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import dataObjects.tagEmoPercentObject;
import dataObjects.tweetObject;
import database.DbBean;  
import javax.naming.NamingException;
import org.aed.bigdata.kafka.XpressionProducer;

@Controller  
public class indexController {  
	
	private ResultSet rs;
	private final ObjectMapper mapper = new ObjectMapper();
	
    private final XpressionProducer producer;
    private final DbBean db;
    public indexController() throws NamingException{
    	producer = new XpressionProducer("xys");
    	db=new DbBean();
    }
    
    @RequestMapping("/allTagPercents")
    @ResponseBody
    public String getAllTagPercents() throws ClassNotFoundException, SQLException, JsonProcessingException {   	
    	
		Connection con=db.getConnection();
		if(con != null){
			System.out.println("!!!!!!!!!!!!!!CONNECTION NOT NULL!!!!!!!!!!!!!!!!!");
			List<tagEmoPercentObject> listOfAllTagPercents = new ArrayList<>();
			StringBuilder percentQuery = new StringBuilder("select id,name,description,coalesce(totalCount,0) as total,coalesce(upsetCount,0) as upset ,coalesce(sadCount,0) as sad ,coalesce(neutralcount,0) as neutral ,coalesce(hapCount,0) as hap,coalesce(gladCount,0) as glad");
			percentQuery.append(" from tag ") ;
			percentQuery.append(" left join (select count(id) as totalCount ,tag_id  from xpression group by tag_id) as totalTab on tag.id = totalTab.tag_id");
			percentQuery.append(" left join (select count(id) as upsetcount,tag_id from xpression where sentiment <1 group by tag_id) as upsetTab on tag.id = upsetTab.tag_id");
			percentQuery.append(" left join (select count(id) as sadcount,tag_id from xpression where sentiment =1 group by tag_id) as sadTab on tag.id = sadTab.tag_id");
			percentQuery.append(" left join (select count(id) as neutralcount,tag_id from xpression where sentiment =2 group by tag_id) as neutralTab on tag.id = neutralTab.tag_id");
			percentQuery.append(" left join (select count(id) as hapcount,tag_id from xpression where sentiment =3 group by tag_id) as hapTab on tag.id = hapTab.tag_id");
			percentQuery.append(" left join (select count(id) as gladcount,tag_id from xpression where sentiment =4 group by tag_id) as gladTab on tag.id = gladTab.tag_id");
			percentQuery.append(" ORDER BY total DESC;");
			
			PreparedStatement pstPercent=con.prepareStatement(percentQuery.toString());	
			rs=pstPercent.executeQuery();		
			while(rs.next()){		
				listOfAllTagPercents.add(new tagEmoPercentObject(rs.getInt("id"),rs.getString("name"),rs.getString("description"),rs.getInt("total"),rs.getInt("upset"),rs.getInt("sad"),rs.getInt("neutral"),rs.getInt("hap"),rs.getInt("glad")));		
			}
			con.close();
			return mapper.writeValueAsString(listOfAllTagPercents);
		}
		else{
			return "";
		}	
    }
    
    
    @RequestMapping("/perTagPercents")
    @ResponseBody
    public String getPerTagPercents(@RequestParam(value="selTag") String tag) throws ClassNotFoundException, SQLException, JsonProcessingException {   	
    	
		Connection con=db.getConnection();
		if(con != null){
			System.out.println("!!!!!!!!!!!!!!CONNECTION NOT NULL!!!!!!!!!!!!!!!!!");
			List<tagEmoPercentObject> listOfAllTagPercents = new ArrayList<>();
			StringBuilder percentQuery = new StringBuilder("select id,name,description,coalesce(totalCount,0) as total,coalesce(upsetCount,0) as upset ,coalesce(sadCount,0) as sad ,coalesce(neutralcount,0) as neutral ,coalesce(hapCount,0) as hap,coalesce(gladCount,0) as glad");
			percentQuery.append(" from (select * from tag where id=?) as tag") ;
			percentQuery.append(" left join (select count(id) as totalCount ,tag_id  from xpression  where tag_id=?  group by tag_id) as totalTab on tag.id = totalTab.tag_id");
			percentQuery.append(" left join (select count(id) as upsetcount,tag_id from xpression where sentiment <1 and tag_id=?  group by tag_id) as upsetTab on tag.id = upsetTab.tag_id");
			percentQuery.append(" left join (select count(id) as sadcount,tag_id from xpression where sentiment =1  and tag_id=? group by tag_id) as sadTab on tag.id = sadTab.tag_id");
			percentQuery.append(" left join (select count(id) as neutralcount,tag_id from xpression where sentiment =2 and tag_id=? group by tag_id) as neutralTab on tag.id = neutralTab.tag_id");
			percentQuery.append(" left join (select count(id) as hapcount,tag_id from xpression where sentiment =3  and tag_id=? group by tag_id) as hapTab on tag.id = hapTab.tag_id");
			percentQuery.append(" left join (select count(id) as gladcount,tag_id from xpression where sentiment =4  and tag_id=? group by tag_id) as gladTab on tag.id = gladTab.tag_id");
			percentQuery.append(" ORDER BY total DESC;");
			
			
			Long tagLong=Long.parseLong(tag);
			PreparedStatement pstPercent=con.prepareStatement(percentQuery.toString());	
			pstPercent.setLong(1, tagLong);
			pstPercent.setLong(2, tagLong);
			pstPercent.setLong(3, tagLong);
			pstPercent.setLong(4, tagLong);
			pstPercent.setLong(5, tagLong);
			pstPercent.setLong(6, tagLong);
			pstPercent.setLong(7, tagLong);
			
			rs=pstPercent.executeQuery();		
			while(rs.next()){		
				listOfAllTagPercents.add(new tagEmoPercentObject(rs.getInt("id"),rs.getString("name"),rs.getString("description"),rs.getInt("total"),rs.getInt("upset"),rs.getInt("sad"),rs.getInt("neutral"),rs.getInt("hap"),rs.getInt("glad")));		
			}
			con.close();
			return mapper.writeValueAsString(listOfAllTagPercents);
		}
		else{
			return "";
		}	
    }
    

    
    @RequestMapping("/postTweet")    
    @ResponseBody
    public String loadTweets(@RequestParam(value="selTag") String tag,@RequestParam(value="selTweet") String tweet) throws NumberFormatException, Exception{
		try{
			producer.produce(Long.parseLong(tag), tweet);
		}
		catch(Exception e){
			System.out.println("*********ERROR IS*********"+e);
		}
    	return "POSTED!!";
    }
    
    
    
    @RequestMapping("/getTweets")     
    @ResponseBody
    public String loadTweets(@RequestParam(value = "curTimeMS") long timeInMS,@RequestParam(value = "hashTag") String hashtag) throws ClassNotFoundException, SQLException{
    	
    	tweetObject temp;
    	List<tweetObject> listObjects=new ArrayList<tweetObject>();
    	Connection con=db.getConnection();
    	String jsonString="";
    	if(con!=null){
    		try {		
    			
    			String selectQuery="select xpression.message,xpression.sentiment,tag.name from xpression,tag where xpression.created_on > ? and tag_id=tag.id and tag.name=? ";		
    			PreparedStatement pst=con.prepareStatement(selectQuery);	
    			java.sql.Timestamp sq = new java.sql.Timestamp(timeInMS);
    			pst.setTimestamp(1, sq, Calendar.getInstance());
    			pst.setString(2, hashtag);
    			rs=pst.executeQuery();
    			while(rs.next()){
    						
    						temp=new tweetObject();
    						temp.sentiment=Integer.parseInt(rs.getString("sentiment"));
    						temp.message=rs.getString("message");
    						temp.tag_id=rs.getString("name");
    						listObjects.add(temp);
    					}
    			} catch (SQLException e1) {
    				// TODO Auto-generated catch block
    				e1.printStackTrace();
    			}
    			
    	    	ObjectMapper mapper=new ObjectMapper();  	
    	    	
    	    	try {
    	    		jsonString=mapper.writeValueAsString(listObjects);
    			} catch (JsonProcessingException e) {
    				// TODO Auto-generated catch block
    				e.printStackTrace();
    			}
    	    	
    	    	con.close();
    	}
    	
    	return jsonString;
      
    }  
    
    
}