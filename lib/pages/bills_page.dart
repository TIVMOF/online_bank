import 'package:flutter/material.dart';
import 'package:online_bank/utill/app_bar.dart';

import '../utill/bottom_app_bar.dart';

class BillsPage extends StatefulWidget {
  final BuildContext context;

  const BillsPage({
    required this.context,
  });

  @override
  State<BillsPage> createState() => _BillsPageState();
}

class _BillsPageState extends State<BillsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: this.context),
      body: SafeArea(
        child: Column(children: [
          MyAppBar(first_name: 'Your', second_name: 'Bills')
        ],)
        ),
    );
  }
}