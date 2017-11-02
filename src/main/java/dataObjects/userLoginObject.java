package dataObjects;

public class userLoginObject{
	public userLoginObject() {
		super();
		// TODO Auto-generated constructor stub
	}
	private Long eventId;
	private String eventName;
	private String access_code;
	
	public userLoginObject(Long eventId, String eventName, String accessCode) {
		super();
		this.eventId = eventId;
		this.eventName = eventName;
		this.access_code = accessCode;
	}
	public Long getEventId() {
		return this.eventId;
	}
	public void setEventId(Long eventId) {
		this.eventId = eventId;
	}
	public String getEventName() {
		return this.eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
	}
	public String getAccess_code() {
		return this.access_code;
	}
	public void setAccess_code(String access_code) {
		this.access_code = access_code;
	}
}
