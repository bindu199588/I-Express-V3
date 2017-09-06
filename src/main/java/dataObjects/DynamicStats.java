package dataObjects;

public class DynamicStats {

	public DynamicStats(String time, String upsetAgg, String sadAgg, String happyAgg, String gladAgg) {
		this.time = time;
		this.gladAgg = gladAgg;
		this.happyAgg = happyAgg;
		this.sadAgg = sadAgg;
		this.upsetAgg = upsetAgg;

	}

	private String time;

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getUpsetAgg() {
		return upsetAgg;
	}

	public void setUpsetAgg(String upsetAgg) {
		this.upsetAgg = upsetAgg;
	}

	public String getSadAgg() {
		return sadAgg;
	}

	public void setSadAgg(String sadAgg) {
		this.sadAgg = sadAgg;
	}

	public String getHappyAgg() {
		return happyAgg;
	}

	public void setHappyAgg(String happyAgg) {
		this.happyAgg = happyAgg;
	}

	public String getGladAgg() {
		return gladAgg;
	}

	public void setGladAgg(String gladAgg) {
		this.gladAgg = gladAgg;
	}

	private String upsetAgg;
	private String sadAgg;
	private String happyAgg;
	private String gladAgg;
}
