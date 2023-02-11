import 'package:flutter/material.dart';
import 'package:online_bank/main.dart';

import '../utill/app_bar.dart';
import '../utill/bottom_app_bar.dart';

class TransactionPage extends StatefulWidget {
  const TransactionPage({super.key});

  @override
  State<TransactionPage> createState() => _TransactionPageState();
}

class _TransactionPageState extends State<TransactionPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: context),
      body: SafeArea(
        child: Column(children: [
          MyAppBar(first_name: 'Трансакции', second_name: ''),
        ],)
        ),
    );
  }
}