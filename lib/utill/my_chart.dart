import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:online_bank/utill/coordinate.dart';

class MyChart extends StatelessWidget {

  final List<Coordinate> points;

  const MyChart(
    this.points,
    {Key? key}
  ):super(key: key);

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 2,
      child: LineChart(
        LineChartData(
          lineBarsData: [
            LineChartBarData(
              spots: points.map((point) => FlSpot(point.x, point.y)).toList(),
              isCurved: true,
              dotData: FlDotData(show: true),
            )
          ]
        ),
      ),
    );
  }
}