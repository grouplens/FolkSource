package org.citizensense.model;

public class TextAnswer implements Answer {
private String type = "text";
private String response;

@Override
public String getType() {
	return this.type;
}
@Override
public void setType(String type) {
	this.type = type;
	
}
@Override
public String getResponse() {
	return this.response;
}
@Override
public void setResponse(String res) {
	this.response = res;
	
}

}
