package dataObjects;

public class aggrObject {
	public aggrObject(int count, String hashtag, String date) {
		this.count = count;
		this.hashtag = hashtag;
		this.date = date;
	}	
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public String getHashtag() {
		return hashtag;
	}
	public void setHashtag(String hashtag) {
		this.hashtag = hashtag;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	private int count;
	private String hashtag;
	private String date;
}
