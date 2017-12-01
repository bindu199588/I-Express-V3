package dataObjects;

public class eventAgendaObject {
	
	private int id;	
	private String agenda;
	private Long start_time;
	private Long end_time;
	private Long event_id;
	private Long created_on;
	
	public eventAgendaObject() {
		super();
	}
	
	public eventAgendaObject(int id, String agenda, Long start_time, Long end_time, Long event_id, Long created_on) {
		super();
		this.id = id;
		this.agenda = agenda;
		this.start_time = start_time;
		this.end_time = end_time;
		this.event_id = event_id;
		this.created_on = created_on;
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAgenda() {
		return agenda;
	}
	public void setAgenda(String agenda) {
		this.agenda = agenda;
	}
	public Long getStart_time() {
		return start_time;
	}
	public void setStart_time(Long start_time) {
		this.start_time = start_time;
	}
	public Long getEnd_time() {
		return end_time;
	}
	public void setEnd_time(Long end_time) {
		this.end_time = end_time;
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
	
}
