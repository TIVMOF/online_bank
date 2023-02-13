import 'package:collection/collection.dart';

class Coordinate {
  final double x;
  final double y;

  Coordinate({
    required this.x,
    required this.y,
  });
}

List<Coordinate>get Coordinates {
  final data = <double>[2, 5, 13, 6, 9, 3, 7];

  return data.mapIndexed(((index, element) => Coordinate(x: index.toDouble(), y: element))).toList();
}
