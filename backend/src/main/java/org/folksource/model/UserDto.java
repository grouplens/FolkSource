package org.folksource.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.folksource.util.TokenService;
import org.folksource.util.UserService;
import org.grouplens.common.dto.Dto;
import org.grouplens.common.dto.DtoContainer;

public class UserDto extends Dto{
	private DtoContainer<UserDto> content = new DtoContainer<UserDto>(UserDto.class, false);

	public Integer id;
	public String name;
	public String email;
	public Integer points;
	public String password;
	
	public UserDto(){
		super();
	}
	/**
	 * Creates a new SubmissionDto object from the given Submission.
	 * @param s
	 */
	public UserDto(User s){
		super();
		name = s.getName();
		email = s.getEmail();
		points = s.getPoints();
		id = s.getId();
	}

	/**
	 * Returns a list of SubmissionDto objects given a list of Submission objects.
	 * @param users
	 * @return
	 */
	public static List<UserDto> fromUserList(List<User> users){
		List<UserDto> userDtos = new ArrayList<UserDto>();
		for (User s : users){
			userDtos.add(new UserDto(s));
		}
		return userDtos;
	}
	public static UserDto[] fromUserArray(User[] users){
		UserDto[] uDtos = new UserDto[users.length];
		for (int i=0; i < users.length; i++){
			uDtos[i] = new UserDto(users[i]);
		}
		return uDtos;
	}
	
	//either returns the user that exists, or creates a new user, based on 
	public User toUser() {
		User u = UserService.getUserByName(this.name);
		if (u == null) {
			u = new User();
			u.setEmail(this.email);
			u.setName(this.name);
			u.setPassword(this.password);
		}
		return u;
	}
}
