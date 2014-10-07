package org.folksource.model;

import java.util.ArrayList;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class UserDetailDto extends Dto{

	public Integer id;
	public String name;
	public String email;
	public Integer points;
	
	public UserDetailDto(){
		super();
	}
	/**
	 * Creates a new SubmissionDto object from the given Submission.
	 * @param s
	 */
	public UserDetailDto(User s){
		super();
		this.id = s.id;
		this.name = s.name;
		this.email = s.email;
		this.points = s.points;
		
	}


	
	
	
	/**
	 * Returns a list of SubmissionDto objects given a list of Submission objects.
	 * @param users
	 * @return
	 */
	public static List<UserDetailDto> fromUserList(List<User> users){
		List<UserDetailDto> userDtos = new ArrayList<UserDetailDto>();
		for (User s : users){
			userDtos.add(new UserDetailDto(s));
		}
		return userDtos;
	}
	public static UserDetailDto[] fromUserArray(User[] users){
		UserDetailDto[] uDtos = new UserDetailDto[users.length];
		for (int i=0; i < users.length; i++){
			uDtos[i] = new UserDetailDto(users[i]);
		}
		return uDtos;
	}
	
}
