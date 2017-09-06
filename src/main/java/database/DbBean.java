package database;

import java.sql.*;
import java.util.*;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.postgresql.ds.PGPoolingDataSource;
 


public class DbBean {
	
	
	
	public DbBean() {
		PGPoolingDataSource source = new PGPoolingDataSource();
		source.setDataSourceName("xys_db");
		source.setServerName("localhost");
		source.setDatabaseName("xys");
		source.setUser("spark");
		source.setPassword("spark");
		source.setMaxConnections(10);
		source.setInitialConnections(3);
		try {
			new InitialContext().rebind("xys_db", source);
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private Connection con = null;
	
	
	public Connection getConnection() 
			throws ClassNotFoundException, SQLException
	{
		
			try {
			    DataSource source = (DataSource)new InitialContext().lookup("xys_db");
			    con = source.getConnection();
			} catch(SQLException e) {
			    System.out.println("log error");
			} catch(NamingException e) {
				System.out.println("*******************ERROR!!!!!!!!!DataSource wasn't found in JNDI******************"+e);
			}
		return con;
	
	}
	public String disconnect()
	{
		String retVal = "";
		if(con != null) {
	        try {
	        	con.close();
	        }
	        catch(SQLException e) {
	        	retVal=e.toString();
	        }
	    }
	
		return(retVal);
	}
}
