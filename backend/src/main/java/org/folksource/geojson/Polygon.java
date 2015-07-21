//package org.folksource.geojson;
//
//import com.vividsolutions.jts.geom.Coordinate;
//import org.grouplens.common.dto.Dto;
//
///**
// * Created by jts on 1/26/15.
// */
//public class Polygon extends Geom {
////    public String type = "Polygon";
//    public Double[][][] coordinates;
//
//    public Polygon(Double[][] coordinates) {
//        super("Polygon");
//        Double[][][] tmp = new Double[1][coordinates.length][2];
//        tmp[0] = coordinates;
//        this.setCoordinates(tmp);
//    }
//
//    public Polygon(com.vividsolutions.jts.geom.Polygon p) {
//        super("Polgyon");
//        Coordinate coords[] = p.getCoordinates();
//        Double[][] middle = new Double[coords.length][2];
//
//        for(int i = 0; i < middle.length; i++) {
//            Coordinate tmpCoord = coords[i];
//            Double[] tmp = new Double[2];
//            tmp[0] = tmpCoord.x;
//            tmp[1] = tmpCoord.y;
//            middle[i] = tmp;
//        }
//
//        Double[][][] top = new Double[1][middle.length][2];
//        top[0] = middle;
//        this.setCoordinates(top);
//    }
//
////    public String getType() {
////        return type;
////    }
////
////    public void setType(String type) {
////        this.type = type;
////    }
////
//
//    public Double[][][] getCoordinates() {
//        return coordinates;
//    }
//
//
//    public void setCoordinates(Double[][][] coordinates) {
//        this.coordinates = coordinates;
//    }
//}
