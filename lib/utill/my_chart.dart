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
    return Container(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: AspectRatio(
        aspectRatio: 2,
        child: LineChart(
          LineChartData(
            backgroundColor: Colors.grey.shade700,
            gridData: FlGridData(
              show: true,
              drawVerticalLine: true,
              getDrawingHorizontalLine: (value) => FlLine(
                color: Colors.grey[300],
                strokeWidth: 0.5,
                dashArray: [10, 5]
              ),
            ),
            lineBarsData: [
              LineChartBarData(
                spots: points.map((point) => FlSpot(point.x, point.y)).toList(),
                isCurved: true,
                dotData: FlDotData(show: true),
              )
            ],
            
          ),
        ),
      ),
    );
  }
}