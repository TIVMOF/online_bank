// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors, sized_box_for_whitespace

import 'package:flutter/material.dart';
import 'package:online_bank/pages/about_page.dart';
import 'package:online_bank/utill/bottom_app_bar.dart';
import 'package:online_bank/utill/my_button.dart';
import 'package:online_bank/utill/my_card.dart';
import 'package:online_bank/utill/my_list_tile.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:online_bank/pages/send_page.dart';

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
          Align(
            alignment: Alignment.topLeft,
            child: Container(
              width: 600,
              decoration: BoxDecoration(
                color: Colors.blue.shade800,
                borderRadius: BorderRadius.only(
                  bottomRight: Radius.circular(95),
                )
              ),
              child: Padding(
                padding: const EdgeInsets.only(left: 30.0, top: 10.0, bottom: 10.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Proper Invest',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            ),
                          ),
                        Text(
                          ' Bank',
                          style: TextStyle(
                            fontSize: 28,
                            color: Colors.white,
                            ),
                          ),
                      ],
                    ),
                    ],
                  ),
              ),
            ),
          ),
      
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
                page: SendPage(context: context)
                ),
      
              //bills button
              MyButton(
                iconImagePath: 'lib/icons/bill.png', 
                buttonText: 'Bills', 
                page: SendPage(context: context)
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
                tileSubtitle: 'Payments and Income'
              ),
      
              //Transactions
              MyListTile(
                iconImagePath: 'lib/icons/lending.png', 
                tileTitle: 'Transactions', 
                tileSubtitle: 'Transaction History'
              )
            ],),
          )
        ],),
      ),
    );
  }
}