package dataObjects;

public class adminLoginObject {
	public adminLoginObject() {
		super();
		// TODO Auto-generated constructor stub
	}
	private String username;
	private String  password;
	
	public adminLoginObject(String username, String password) {
		super();
		this.username = username;
		this.password = password;
	}
	
	public String getPassword() {
		return this.password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getUsername() {
		return this.username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	
}
