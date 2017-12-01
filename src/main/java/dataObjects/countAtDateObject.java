package dataObjects;

public class countAtDateObject {

	public countAtDateObject() {
		super();
		// TODO Auto-generated constructor stub
	}
	private Long count;
	private Long created_on;
	
	public countAtDateObject(Long count, Long created_on) {
		super();
		this.count = count;
		this.created_on = created_on;
	}
	
	
	public Long getCount() {
		return count;
	}
	public void setCount(Long count) {
		this.count = count;
	}
	public Long getCreated_on() {
		return created_on;
	}
	public void setCreated_on(Long created_on) {
		this.created_on = created_on;
	}
	
}
