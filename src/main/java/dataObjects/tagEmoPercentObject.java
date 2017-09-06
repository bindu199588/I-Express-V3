package dataObjects;

public class tagEmoPercentObject {

	public tagEmoPercentObject(int id, String name, String description, int total, int upset, int sad, int neutral,int happy, int glad) {
		this.id = id;
		this.name = name;
		this.desc = description;
		this.total = total;
		this.upset = upset;
		this.sad = sad;
		this.neutral = neutral;
		this.happy = happy;
		this.glad = glad;
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
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getUpset() {
		return upset;
	}
	public void setUpset(int upset) {
		this.upset = upset;
	}
	public int getSad() {
		return sad;
	}
	public void setSad(int sad) {
		this.sad = sad;
	}
	public int getHappy() {
		return happy;
	}
	public void setHappy(int happy) {
		this.happy = happy;
	}
	public int getGlad() {
		return glad;
	}
	public void setGlad(int glad) {
		this.glad = glad;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public int getNeutral() {
		return neutral;
	}
	public void setNeutral(int neutral) {
		this.neutral = neutral;
	}
	private int id;
	private String name;
	private String desc;
	private int total;
	private int upset;
	private int sad;
	private int neutral;
	private int happy;
	private int glad;
}
