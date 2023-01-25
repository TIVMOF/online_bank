import 'package:flutter/material.dart';
import 'package:online_bank/utill/app_bar.dart';
import 'package:online_bank/utill/bottom_app_bar.dart';

class PayPage extends StatefulWidget {
  final BuildContext context;

  const PayPage({
    required this.context,
    });

  @override
  State<PayPage> createState() => _PayPageState();
}

class _PayPageState extends State<PayPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: this.widget.context),
      body: SafeArea(
        child: Column(children: [
          MyAppBar(first_name: 'Pay', second_name: 'Now')
        ],)
        ),
    );
  }
}