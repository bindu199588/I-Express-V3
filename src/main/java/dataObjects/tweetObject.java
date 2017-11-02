package dataObjects;

public class tweetObject {
	private String message;
	private int sentiment;
	private String tag_id;
	
	public tweetObject(String message, int sentiment, String tag_id) {
		super();
		this.message = message;
		this.sentiment = sentiment;
		this.tag_id = tag_id;
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
	public String getTag_id() {
		return tag_id;
	}
	public void setTag_id(String tag_id) {
		this.tag_id = tag_id;
	}
	
	
}
