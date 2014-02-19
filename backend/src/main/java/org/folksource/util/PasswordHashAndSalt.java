package org.folksource.util;

public class PasswordHashAndSalt {
    private final String passwordHash;
    private final String salt;
    
    public PasswordHashAndSalt(String passwordHash, String salt) {
        this.passwordHash = passwordHash;
        this.salt = salt;
    }
    
    public String getPasswordHash() {
        return passwordHash;
    }
    
    public String getSalt() {
        return salt;
    }
}
