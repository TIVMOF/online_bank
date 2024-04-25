// ignore_for_file: unused_import
import 'package:flutter/material.dart';
import '../utill/app_bar.dart';
import '../utill/my_chart.dart';
import '../utill/bottom_app_bar.dart';

class StatsPage extends StatefulWidget {
  final String fullName;
  final int userId;

  const StatsPage({super.key, required this.fullName, required this.userId});

  @override
  State<StatsPage> createState() => _StatsPageState();
}

class _StatsPageState extends State<StatsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(
          context: context, fullName: widget.fullName, userId: widget.userId),
      body: SafeArea(
          child: Column(
        children: [
          MyAppBar(first_name: 'Статистики', second_name: ''),
          MyChart(
            title: 'Разплащания и доходи',
          ),
        ],
      )),
    );
  }
}
