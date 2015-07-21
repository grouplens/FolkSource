//package org.folksource.geojson;
//
//import com.vividsolutions.jts.geom.Coordinate;
//import com.vividsolutions.jts.geom.Geometry;
//
///**
// * Created by jts on 1/26/15.
// */
//public class Point extends Geom {
//    public Double[] coordinates;
////    public String type = "Point";
//
////    public Point(Double[] coordinates) {
////        super("Point");
////        this.coordinates = coordinates;
////    }
//
//    public Point(com.vividsolutions.jts.geom.Point p) {
//        super("Point");
//        Double[] tmp = new Double[2];
//        tmp[0] = p.getCoordinate().x;
//        tmp[1] = p.getCoordinate().y;
//        this.setCoordinates(tmp);
//    }
//
//    public Double[] getCoordinates() {
//        return coordinates;
//    }
//
//    public void setCoordinates(Double[] coordinates) {
//        this.coordinates = coordinates;
//    }
//
//    //TODO fix this
////    @Override
////    public Geometry getGeometry() {
////        Coordinate c = new Coordinate(coordinates[0], coordinates[1]);
////        c.
////        return new com.vividsolutions.jts.geom.Point()
////    }
//
//    //    public String getType() {
////        return type;
////    }
////
////    public void setType(String type) {
////        this.type = type;
////    }
//}
