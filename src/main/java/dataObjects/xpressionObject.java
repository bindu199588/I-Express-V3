package dataObjects;

public class xpressionObject {
	
	public xpressionObject() {
		super();
		// TODO Auto-generated constructor stub
	}
	private String message;
	private int sentiment;
	private String id;	
	private String tag_id;
	private Long created_on;
	
	public xpressionObject(String message, int sentiment, String id, String tag_id, Long created_on) {
		super();
		this.message = message;
		this.sentiment = sentiment;
		this.id = id;
		this.tag_id = tag_id;
		this.created_on = created_on;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getSentiment() {
		return sentiment;
	}
	public void setSentiment(int sentiment) {
		this.sentiment = sentiment;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTag_id() {
		return tag_id;
	}
	public void setTag_id(String tag_id) {
		this.tag_id = tag_id;
	}
	public Long getCreated_on() {
		return created_on;
	}
	public void setCreated_on(Long created_on) {
		this.created_on = created_on;
	}
	
}
