// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors, sized_box_for_whitespace

import 'package:flutter/material.dart';
import 'package:online_bank/pages/pay_page.dart';
import 'package:online_bank/pages/statistics_page.dart';
import 'package:online_bank/pages/transaction_page.dart';
import 'package:online_bank/utill/app_bar.dart';
import 'package:online_bank/utill/bottom_app_bar.dart';
import 'package:online_bank/utill/my_button.dart';
import 'package:online_bank/utill/my_card.dart';
import 'package:online_bank/utill/my_list_tile.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:online_bank/pages/send_page.dart';

import 'bills_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}


class _HomePageState extends State<HomePage> {

  final _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: context),
      body: SafeArea(
        child: Column(children: [
          // app bar
          MyAppBar(first_name: 'Proper Invest', second_name: 'Bank'),
      
          SizedBox(height: 25,),
        
          // cards
          Container(
            height: 200,
            child: PageView(
              scrollDirection: Axis.horizontal,
              controller: _controller,
              children: [
                MyCard(
                  balance: 5250.20,
                  cardNumber: 12345678,
                  expiryDate: 4,
                  expiryMonth: 10,
                  expiryYear: 24,
                  color: Colors.deepPurple,
                ),
                MyCard(
                  balance: 4250.24,
                  cardNumber: 11345678,
                  expiryDate: 5,
                  expiryMonth: 11,
                  expiryYear: 23,
                  color: Colors.deepOrange,
                ),
                MyCard(
                  balance: 250.99,
                  cardNumber: 12355678,
                  expiryDate: 3,
                  expiryMonth: 12,
                  expiryYear: 25,
                  color: Colors.blue,
                ),
                
            ],
            )
          ),
      
          SizedBox(height: 15),
      
          SmoothPageIndicator(
            controller: _controller, 
            count: 3,
            effect: ExpandingDotsEffect(
              activeDotColor: Colors.blue.shade900,
            ),
            ),
      
            SizedBox(height: 20),
      
          // 3 buttons ->send + pay + bills
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
              // send button
              MyButton(
                iconImagePath: 'lib/icons/send.png', 
                buttonText: 'Send', 
                page: SendPage(context: context)
                ),
              
              //pay button
              MyButton(
                iconImagePath: 'lib/icons/credit-card.png', 
                buttonText: 'Pay', 
                page: PayPage(context: context)
                ),
      
              //bills button
              MyButton(
                iconImagePath: 'lib/icons/bill.png', 
                buttonText: 'Bills', 
                page: BillsPage(context: context)
                ),
            ],),
          ),

          SizedBox(height: 20),
        
          // column -> stats + transaction
          Padding(
            padding: const EdgeInsets.all(25.0),
            child: Column(children: [
              //Stats
              MyListTile(
                iconImagePath: 'lib/icons/statistics.png', 
                tileTitle: 'Statistics', 
                tileSubtitle: 'Payments and Income',
                page: StatsPage(),
              ),
      
              //Transactions
              MyListTile(
                iconImagePath: 'lib/icons/lending.png', 
                tileTitle: 'Transactions', 
                tileSubtitle: 'Transaction History',
                page: TransactionPage(),
              )
            ],),
          )
        ],),
      ),
    );
  }
}