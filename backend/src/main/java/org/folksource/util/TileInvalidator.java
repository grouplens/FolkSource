package org.folksource.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

/**
 * Created by theba004 on 6/3/15.
 */
public class TileInvalidator extends Thread {
    private String ext;

    public TileInvalidator(String extension) {
        this.ext = extension;
    }

    public void run() {
        try {
            InputStream stream =  new URL("http://innsbruck-umh.cs.umn.edu/tiles/all" + this.ext).openStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(stream));
            Integer strTemp = 0;
            while (-1 != (strTemp = br.read())) {
//                System.out.println(strTemp);
            }
            br.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        System.out.println(this.ext + " DONE");
    }
}
