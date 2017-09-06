package dataObjects;

import java.util.List;

public class aggrArray {

	public aggrArray(List<aggrObject> hap, List<aggrObject> sad) {
		this.hap = hap;
		this.sad = sad;
	}
	private List<aggrObject> hap;
	public List<aggrObject> getHap() {
		return hap;
	}
	public void setHap(List<aggrObject> hap) {
		this.hap = hap;
	}
	public List<aggrObject> getSad() {
		return sad;
	}
	public void setSad(List<aggrObject> sad) {
		this.sad = sad;
	}
	private List<aggrObject> sad;
}
