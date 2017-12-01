package dataObjects;

public class questionObject {

	
	public questionObject() {
		super();
	}
	private String id;	
	private String question;
	private Long event_id;
	private Long created_on;
	private Long count;
	
	
	public questionObject(String id, String question, Long event_id, Long created_on, Long count) {
		super();
		this.id = id;
		this.question = question;
		this.event_id = event_id;
		this.created_on = created_on;
		this.count = count;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public Long getEvent_id() {
		return event_id;
	}
	public void setEvent_id(Long event_id) {
		this.event_id = event_id;
	}
	public Long getCreated_on() {
		return created_on;
	}
	public void setCreated_on(Long created_on) {
		this.created_on = created_on;
	}
	public Long getCount() {
		return count;
	}
	public void setCount(Long count) {
		this.count = count;
	}
}
