/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import com.citizensense.android.db.CsDbAdapter;
import com.google.android.maps.MapView;

/**
 * This class allows static access to many of the most-used components of 
 * Citizen Sense. This is similar to Cyclopath's G.java.
 * @author Phil Brown
 */

public class G {
	protected static MapView map;
	protected static User user;
	protected static CsDbAdapter db;
}
