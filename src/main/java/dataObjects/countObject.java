package dataObjects;

public class countObject {
	
	public countObject(int c,int id,String h){
		this.setCount(c);
		this.setTag_id(id);
		this.setHashtag(h);
		
	}
	public String getHashtag() {
		return hashtag;
	}
	public void setHashtag(String hashtag) {
		this.hashtag = hashtag;
	}
	
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}

	public int getTag_id() {
		return tag_id;
	}
	public void setTag_id(int tag_id) {
		this.tag_id = tag_id;
	}

	private int count;
	private int tag_id;
	private String hashtag;
}
