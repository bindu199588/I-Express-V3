package dataObjects;

public class PrivateStringObject {

	public PrivateStringObject(String secretString) {
		super();
		this.secretString = secretString;
	}

	public PrivateStringObject() {
		super();
	}

	private String secretString;

	public String getSecretString() {
		return secretString;
	}

	public void setSecretString(String secretString) {
		this.secretString = secretString;
	}
	
}
