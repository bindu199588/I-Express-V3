package dataObjects;

public class eventObject {
	
	int id;
	String name;
	String description;
	private boolean isactive;
	Long created_on;
	String access_code;
	
	

	public eventObject(int id, String name, String description, boolean isactive, Long created_on, String access_code) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.isactive = isactive;
		this.created_on = created_on;
		this.access_code = access_code;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Long getCreated_on() {
		return created_on;
	}
	public void setCreated_on(Long created_on) {
		this.created_on = created_on;
	}
	public boolean isIsactive() {
		return isactive;
	}
	public void setIsactive(boolean isactive) {
		this.isactive = isactive;
	}
	public String getAccess_code() {
		return access_code;
	}

	public void setAccess_code(String access_code) {
		this.access_code = access_code;
	}
	
}
