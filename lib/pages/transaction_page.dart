import 'package:flutter/material.dart';
import 'package:online_bank/main.dart';
import 'package:online_bank/utill/my_transaction.dart';
import 'package:online_bank/utill/read_more.dart';

import '../utill/app_bar.dart';
import '../utill/bottom_app_bar.dart';

class TransactionPage extends StatefulWidget {
  const TransactionPage({super.key});

  @override
  State<TransactionPage> createState() => _TransactionPageState();
}

class _TransactionPageState extends State<TransactionPage> {
  final _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: context),
      body: SafeArea(
        child: Column(children: [
          MyAppBar(first_name: 'Трансакции', second_name: ''),

          // recent transactions
          MyRead(
            content: 'Скорошни трансакции', 
            trimLines: 2, 
            align: TextAlign.center, 
            size: 25, 
            weight: FontWeight.bold
            ),

          Container(
            height: 300,
            child: Padding(
              padding: const EdgeInsets.only(right: 5),
              child: Scrollbar(
                controller: _controller,
                child: ListView(
                  scrollDirection: Axis.vertical,
                  controller: _controller,
                  children: [
                    MyTransaction(
                      recipient: 'Гергана Михова',
                      date: '16.02.2023',
                      sum: 30.50,
                      sentOrReceived: true,
                    ),
              
                    MyTransaction(
                      recipient: 'Гергана Михова',
                      date: '16.02.2023',
                      sum: 30.50,
                      sentOrReceived: false,
                    ),
              
                    MyTransaction(
                      recipient: 'Гергана Михова',
                      date: '16.02.2023',
                      sum: 30.50,
                      sentOrReceived: true,
                    ),
              
                    MyTransaction(
                      recipient: 'Гергана Михова',
                      date: '16.02.2023',
                      sum: 30.50,
                      sentOrReceived: false,
                    ),
              
                    MyTransaction(
                      recipient: 'Гергана Михова',
                      date: '16.02.2023',
                      sum: 30.50,
                      sentOrReceived: true,
                    ),
              
                    MyTransaction(
                      recipient: 'Гергана Михова',
                      date: '16.02.2023',
                      sum: 30.50,
                      sentOrReceived: false,
                    ),
                    
                  ],
                ),
              ),
            ),
          )
        ],)
        ),
    );
  }
}