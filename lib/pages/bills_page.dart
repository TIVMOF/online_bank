// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors

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

  final _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: this.context),
      body: SafeArea(
        child: Column(
          children: [
            MyAppBar(first_name: 'Your', second_name: 'Bills'),

            Padding(
              padding: const EdgeInsets.symmetric(vertical: 25.0),
              child: Container(
                height: 200,
                child: PageView(
                  scrollDirection: Axis.vertical,
                  controller: _controller,
                  children: [
                    Container(
                      width: 500,
                      color: Color.fromARGB(60, 0, 66, 117),
                    )
                  ],
                ),
              ),
            )
        ],)
        ),
    );
  }
}