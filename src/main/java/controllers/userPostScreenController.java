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
import com.fasterxml.jackson.databind.ObjectMapper;

import dataObjects.tagEmoPercentObject;
import dataObjects.xpressionObject;

@Controller
public class userPostScreenController extends indexController{

	public userPostScreenController() throws NamingException {
		super();		
	}
	
	
	@RequestMapping("/perTagPercents")
	@ResponseBody
	public String getPerTagPercents(@RequestParam(value = "selTag") String tag)
			throws ClassNotFoundException, SQLException, JsonProcessingException {

		ResultSet rs;
		List<tagEmoPercentObject> listOfAllTagPercents = new ArrayList<>();
		try (Connection con = db.getConnection()) {
			if (con != null) {
				//System.out.println("!!!!!!!!!!!!!!CONNECTION NOT NULL!!!!!!!!!!!!!!!!!");

				StringBuilder percentQuery = new StringBuilder(
						"select id,name,description,coalesce(totalCount,0) as total,coalesce(upsetCount,0) as upset ,coalesce(sadCount,0) as sad ,coalesce(neutralcount,0) as neutral ,coalesce(hapCount,0) as hap,coalesce(gladCount,0) as glad");
				percentQuery.append(" from (select * from tag where id=?) as tag");
				percentQuery.append(
						" left join (select count(id) as totalCount ,tag_id  from xpression  where tag_id=?  group by tag_id) as totalTab on tag.id = totalTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as upsetcount,tag_id from xpression where sentiment <1 and tag_id=?  group by tag_id) as upsetTab on tag.id = upsetTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as sadcount,tag_id from xpression where sentiment =1  and tag_id=? group by tag_id) as sadTab on tag.id = sadTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as neutralcount,tag_id from xpression where sentiment =2 and tag_id=? group by tag_id) as neutralTab on tag.id = neutralTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as hapcount,tag_id from xpression where sentiment =3  and tag_id=? group by tag_id) as hapTab on tag.id = hapTab.tag_id");
				percentQuery.append(
						" left join (select count(id) as gladcount,tag_id from xpression where sentiment =4  and tag_id=? group by tag_id) as gladTab on tag.id = gladTab.tag_id");
				percentQuery.append(" ORDER BY total DESC;");

				Long tagLong = Long.parseLong(tag);
				PreparedStatement pstPercent = con.prepareStatement(percentQuery.toString());
				pstPercent.setLong(1, tagLong);
				pstPercent.setLong(2, tagLong);
				pstPercent.setLong(3, tagLong);
				pstPercent.setLong(4, tagLong);
				pstPercent.setLong(5, tagLong);
				pstPercent.setLong(6, tagLong);
				pstPercent.setLong(7, tagLong);

				rs = pstPercent.executeQuery();
				while (rs.next()) {
					listOfAllTagPercents.add(new tagEmoPercentObject(rs.getInt("id"), rs.getString("name"),
							rs.getString("description"), rs.getInt("total"), rs.getInt("upset"), rs.getInt("sad"),
							rs.getInt("neutral"), rs.getInt("hap"), rs.getInt("glad")));
				}

				return mapper.writeValueAsString(listOfAllTagPercents);
			} else {
				return "";
			}
		}
	}

	@RequestMapping("/postTweet")
	@ResponseBody
	public String postTweets(@RequestParam(value = "selTag") String tag, @RequestParam(value = "selTweet") String tweet)
			throws NumberFormatException, Exception {
		try {
			producer.produce(Long.parseLong(tag), tweet);
		} catch (Exception e) {
			System.out.println("*********ERROR IS*********" + e);
		}
		return "POSTED!!";
	}

	@RequestMapping("/getTweets")
	@ResponseBody
	public String loadTweets(@RequestParam(value = "curTimeMS") long timeInMS,
			@RequestParam(value = "hashTag") String hashtag) throws ClassNotFoundException, SQLException {
		
		ResultSet rs;
		xpressionObject temp;
		List<xpressionObject> listObjects = new ArrayList<xpressionObject>();
		String jsonString = "";

		try (Connection con = db.getConnection()) {

			if (con != null) {
				try {
					String selectQuery = "select xpression.message,xpression.sentiment,tag.name,floor(extract(epoch from xpression.created_on)*1000) as created_on from xpression,tag where date(xpression.created_on) >= date(now()) and floor(extract(epoch from xpression.created_on)*1000) > ? and tag_id=tag.id and tag.id=? order by xpression.created_on";
					PreparedStatement pst = con.prepareStatement(selectQuery);
					//java.sql.Timestamp sq = new java.sql.Timestamp(timeInMS);
					pst.setLong(1,timeInMS);
					pst.setLong(2, Long.parseLong(hashtag));
					//System.out.println(pst.toString());
					rs = pst.executeQuery();
					while (rs.next()) {
						temp = new xpressionObject(rs.getString("message"),Integer.parseInt(rs.getString("sentiment")),"", rs.getString("name"),rs.getLong("created_on"));
						listObjects.add(temp);
					}
				} catch (SQLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				ObjectMapper mapper = new ObjectMapper();

				try {
					jsonString = mapper.writeValueAsString(listObjects);
				} catch (JsonProcessingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}

		return jsonString;

	}
	
}
