import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:flutter/material.dart';

class MyChart extends StatelessWidget {
  final String title;

  const MyChart({
    super.key,
    required this.title,
    });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: SizedBox(
        height: 500,
        child: SfCartesianChart(
          backgroundColor: Colors.grey[300],
          legend: Legend(
            isVisible: true,
            position: LegendPosition.bottom,
            ),
          primaryXAxis: CategoryAxis(  
            maximumLabels: 3,
          ),
          primaryYAxis: NumericAxis(labelFormat: '{value} лв'),
          zoomPanBehavior: ZoomPanBehavior(  
            enablePanning: true,   
          ),  
          enableAxisAnimation: true,
          title: ChartTitle(text: title),
          tooltipBehavior: TooltipBehavior(enable: true),
          series: <ChartSeries>[
            SplineAreaSeries<ChartData, String>(
              name: 'Разплащания',
              dataSource: [
                ChartData('Jan', 35),
                ChartData('Feb', 28),
                ChartData('Mar', 34),
                ChartData('Apr', 32),
                ChartData('May', 40),
                ChartData('June', 45),
                ChartData('July', 65),
                ChartData('August', 89),
                ChartData('September', 40),
                ChartData('November', 23),
                ChartData('October', 69),
                ChartData('December', 34),
              ],
              color: Color.fromARGB(214, 0, 140, 255),
              xValueMapper: (ChartData data, _) => data.x,
              yValueMapper: (ChartData data, _) => data.y,
              ),
            SplineAreaSeries<ChartData, String>(
              name: 'Доходи',
              dataSource: [
                ChartData('Jan', 25),
                ChartData('Feb', 67),
                ChartData('Mar', 58),
                ChartData('Apr', 32),
                ChartData('May', 56),
                ChartData('June', 80),
                ChartData('July', 54),
                ChartData('August', 53),
                ChartData('September', 78),
                ChartData('November', 43),
                ChartData('October', 39),
                ChartData('December', 40),
              ],
              color: Color.fromARGB(181, 73, 173, 255),
              xValueMapper: (ChartData data, _) => data.x,
              yValueMapper: (ChartData data, _) => data.y,
              ),
          ],
        ),
      ),
    );
  }
}

class ChartData {
        ChartData(this.x, this.y);
        final String x;
        final double? y;
    }