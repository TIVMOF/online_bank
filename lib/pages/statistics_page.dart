import 'package:flutter/material.dart';
import 'package:online_bank/utill/app_bar.dart';
import 'package:online_bank/utill/my_chart.dart';

import '../utill/bottom_app_bar.dart';
import '../utill/coordinate.dart';

class StatsPage extends StatefulWidget {
  const StatsPage({super.key});

  @override
  State<StatsPage> createState() => _StatsPageState();
}

class _StatsPageState extends State<StatsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: context),
      body: SafeArea(
        child: Column(children: [
          MyAppBar(first_name: 'Статистики', second_name: ''),

          MyChart(title: 'Разплащания и доходи',),
        ],)
        ),
    );
  }
}