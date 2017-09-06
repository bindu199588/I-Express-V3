package dataObjects;

import java.util.List;

public class countArray {
	public countArray(List<countObject> a,List<countObject> b){
		this.setHap(a);
		this.setSad(b);
	}
	public List<countObject> getHap() {
		return hap;
	}
	public void setHap(List<countObject> hap) {
		this.hap = hap;
	}
	public List<countObject> getSad() {
		return sad;
	}
	public void setSad(List<countObject> sad) {
		this.sad = sad;
	}
	private List<countObject> hap;
	private List<countObject> sad;
	
}
