package dataObjects;

public class tagObject {
	int id;	
	String name;
	Long created_on;
	String description;
	Long event_id;
	
	public tagObject(int id, String name, Long created_on, String description, Long event_id) {
		super();
		this.id = id;
		this.name = name;
		this.created_on = created_on;
		this.description = description;
		this.event_id = event_id;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Long getCreated_on() {
		return created_on;
	}
	public void setCreated_on(Long created_on) {
		this.created_on = created_on;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Long getEvent_id() {
		return event_id;
	}
	public void setEvent_id(Long event_id) {
		this.event_id = event_id;
	}
}
